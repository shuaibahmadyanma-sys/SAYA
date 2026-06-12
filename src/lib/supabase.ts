import { createClient } from '@supabase/supabase-js';

// These values come from your Supabase dashboard: Project Settings > API
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
console.log("CHECKING LIVE KEYS:", import.meta.env.VITE_SUPABASE_URL);
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
  );
}

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper to get current user with profile data
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

// Helper to upload file to Supabase Storage
export async function uploadFile(
  bucket: string,
  filePath: string,
  file: File
) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

// Subscribe to real-time changes
export function subscribeToTable(
  table: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}
