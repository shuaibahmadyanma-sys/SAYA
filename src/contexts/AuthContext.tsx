import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  cover_image: string | null;
  verification_level: 'none' | 'blue' | 'gold' | 'grey' | 'free';
  role: 'reader' | 'writer' | 'thinker' | 'pro';
  is_premium: boolean;
  created_at: string;
  followers_count?: number;
  following_count?: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, username: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile with follower counts
  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, followers_count:follows!following_id(count), following_count:follows!follower_id(count)`)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      setIsLoading(false);
      return;
    }

    // Format counts from the nested response
    const profileData = data as any;
    setProfile({
      ...profileData,
      followers_count: profileData.followers_count?.[0]?.count ?? 0,
      following_count: profileData.following_count?.[0]?.count ?? 0,
    });
    setIsLoading(false);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      await loadProfile(data.user.id);
    }
    return { error: null };
  }, []);

  const signup = useCallback(async (name: string, username: string, email: string, password: string) => {
    // Check if username is available
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      return { error: 'Username is already taken' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Profile is auto-created by database trigger
    if (data.user) {
      await loadProfile(data.user.id);
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id);

    if (error) return { error: error.message };

    await refreshProfile();
    return { error: null };
  }, [user, refreshProfile]);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) return { url: null, error: 'Not authenticated' };

    const filePath = `avatars/${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('saya-uploads')
      .upload(filePath, file, { upsert: true });

    if (uploadError) return { url: null, error: uploadError.message };

    const { data } = supabase.storage
      .from('saya-uploads')
      .getPublicUrl(filePath);

    // Update profile with new avatar
    await updateProfile({ avatar: data.publicUrl });

    return { url: data.publicUrl, error: null };
  }, [user, updateProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshProfile,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
