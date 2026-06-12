import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Calendar, ArrowLeft, Mail, FileText, MessageCircle, Check, Image as ImageIcon, Play, Heart, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  cover_image: string | null;
  verification_level: string;
  role: string;
  created_at: string;
};

function VerificationBadge({ level }: { level: string }) {
  if (level === 'none') return null;
  const styles: Record<string, string> = { blue: 'bg-blue-500', gold: 'bg-gradient-to-br from-yellow-400 to-yellow-600', grey: 'bg-gray-500', free: 'bg-gradient-to-br from-purple-500 to-pink-500' };
  return <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${styles[level] || 'bg-blue-500'} text-xs font-bold ml-1`}><Check className="w-3 h-3" /></span>;
}

const roleColors: Record<string, string> = { reader: 'bg-blue-100 text-blue-700', writer: 'bg-purple-100 text-purple-700', thinker: 'bg-amber-100 text-amber-700', pro: 'bg-green-100 text-green-700' };
const roleLabels: Record<string, string> = { reader: 'Reader', writer: 'Writer', thinker: 'Thinker', pro: 'Professional' };

export default function ProfilePage() {
  const { username } = useParams();
  const { profile: currentProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const isOwnProfile = !username || username === currentProfile?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let profileData: Profile | null = null;

        if (isOwnProfile && currentProfile) {
          profileData = currentProfile as Profile;
        } else {
          const targetUsername = username || currentProfile?.username;
          if (!targetUsername) { setLoading(false); return; }

          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', targetUsername)
            .single();

          if (error) { setLoading(false); return; }
          profileData = data;
        }

        if (!profileData) { setLoading(false); return; }
        setProfile(profileData);

        // Fetch posts
        const { data: postsData } = await supabase
          .from('posts')
          .select(`*, likes_count:likes(count), comments_count:comments(count)`)
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false });

        setPosts((postsData || []).map((p: any) => ({
          ...p,
          likes_count: p.likes_count?.[0]?.count ?? 0,
          comments_count: p.comments_count?.[0]?.count ?? 0,
        })));

        // Fetch follow counts
        const { count: fCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', profileData.id);
        const { count: gCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', profileData.id);
        setFollowerCount(fCount || 0);
        setFollowingCount(gCount || 0);

        // Check if following
        if (!isOwnProfile && currentProfile) {
          const { data: fData } = await supabase.from('follows').select('id').eq('follower_id', currentProfile.id).eq('following_id', profileData.id).single();
          setFollowing(!!fData);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentProfile, isOwnProfile]);

  const handleFollow = async () => {
    if (!currentProfile || !profile) return;
    try {
      if (following) {
        await supabase.from('follows').delete().eq('follower_id', currentProfile.id).eq('following_id', profile.id);
        setFollowerCount(prev => prev - 1);
      } else {
        await supabase.from('follows').insert({ follower_id: currentProfile.id, following_id: profile.id } as any);
        setFollowerCount(prev => prev + 1);
      }
      setFollowing(!following);
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const formatNumber = (num: number) => num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <div className="flex gap-4"><Skeleton className="w-24 h-24 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/2" /></div></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="max-w-2xl mx-auto py-20 text-center"><h1 className="text-2xl font-bold text-[#141416] mb-4">User not found</h1><Link to="/feed" className="text-[#B48C5A] hover:underline">Back to feed</Link></div>;
  }

  const userPosts = posts;
  const userArticles = posts.filter((p: any) => p.type === 'article');
  const userVideos = posts.filter((p: any) => p.type === 'video');
  const userMedia = posts.filter((p: any) => p.image_url || p.video_url);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/feed" className="flex items-center gap-3 text-[#141416] hover:text-[#B48C5A]"><ArrowLeft className="w-5 h-5" /><span className="font-semibold">Back</span></Link>
          {isOwnProfile && <Link to="/settings" className="p-2 rounded-lg hover:bg-[#E8E4DE] text-[#6E6A63]"><Settings className="w-5 h-5" /></Link>}
        </div>
      </div>

      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-br from-[#B48C5A] to-[#8B6914] relative overflow-hidden">
          {profile.cover_image && <img src={profile.cover_image} alt="Cover" className="w-full h-full object-cover" />}
        </div>

        <div className="px-4 md:px-6 pb-6">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-[#F4F1EC]">
                <AvatarImage src={profile.avatar || ''} alt={profile.name || ''} />
                <AvatarFallback className="text-3xl">{profile.name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              {profile.verification_level !== 'none' && (
                <div className="absolute -bottom-1 -right-1"><VerificationBadge level={profile.verification_level} /></div>
              )}
            </div>

            <div className="flex gap-3 mb-2">
              {!isOwnProfile && (
                <>
                  <Button variant="outline" size="icon" className="border-[#D9D5CE] hover:bg-[#E8E4DE]"><Mail className="w-5 h-5" /></Button>
                  <Button onClick={handleFollow} className={following ? 'bg-transparent border border-[#D9D5CE] text-[#141416] hover:bg-[#E8E4DE]' : 'bg-[#141416] text-[#F4F1EC] hover:bg-[#2a2a2c]'}>
                    {following ? <><Check className="w-4 h-4 mr-2" />Following</> : 'Follow'}
                  </Button>
                </>
              )}
              {isOwnProfile && <Link to="/settings"><Button variant="outline" className="border-[#D9D5CE] text-[#141416] hover:bg-[#E8E4DE]">Edit profile</Button></Link>}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[#141416]">{profile.name}</h1>
              {profile.verification_level !== 'none' && <VerificationBadge level={profile.verification_level} />}
            </div>
            <p className="text-[#6E6A63]">@{profile.username}</p>
          </div>

          <p className="text-[#141416] mb-4 max-w-2xl">{profile.bio || 'No bio yet.'}</p>

          <div className="flex flex-wrap gap-4 text-[#6E6A63] text-sm mb-4">
            {profile.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{profile.location}</span></div>}
            {profile.website && <div className="flex items-center gap-1"><LinkIcon className="w-4 h-4" /><a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-[#B48C5A] hover:underline">{profile.website}</a></div>}
            {profile.created_at && <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>}
            <Badge className={roleColors[profile.role] || 'bg-gray-100 text-gray-700'}>{roleLabels[profile.role] || profile.role}</Badge>
          </div>

          <div className="flex gap-6 text-sm">
            <span><span className="font-bold text-[#141416]">{formatNumber(followingCount)}</span><span className="text-[#6E6A63]"> Following</span></span>
            <span><span className="font-bold text-[#141416]">{formatNumber(followerCount)}</span><span className="text-[#6E6A63]"> Followers</span></span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="w-full bg-white border-b border-[#D9D5CE] rounded-none h-auto p-0 justify-start overflow-x-auto">
          {['posts','replies','media','articles','videos','likes'].map(tab => (
            <TabsTrigger key={tab} value={tab} className="rounded-none py-4 px-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none whitespace-nowrap capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {userPosts.length > 0 ? userPosts.map(post => (
            <article key={post.id} className="border-b border-[#D9D5CE] p-4">
              <p className="text-[#141416] mb-2">{post.content}</p>
              {post.image_url && <img src={post.image_url} alt="" className="rounded-xl max-h-80 w-full object-cover mb-2" />}
              {post.video_url && <video src={post.video_url} poster={post.video_thumbnail || ''} className="rounded-xl max-h-80 w-full" controls />}
              <div className="flex items-center gap-4 mt-2 text-sm text-[#6E6A63]">
                <span>{post.comments_count} comments</span>
                <span>{post.likes_count} likes</span>
              </div>
            </article>
          )) : <div className="text-center py-20"><FileText className="w-12 h-12 text-[#D9D5CE] mx-auto mb-4" /><h3 className="text-lg font-semibold text-[#141416]">No posts yet</h3></div>}
        </TabsContent>

        <TabsContent value="replies" className="mt-0">
          <div className="text-center py-20"><MessageCircle className="w-12 h-12 text-[#D9D5CE] mx-auto mb-4" /><h3 className="text-lg font-semibold text-[#141416]">No replies yet</h3></div>
        </TabsContent>

        <TabsContent value="media" className="mt-0">
          {userMedia.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 p-4">
              {userMedia.map(post => (
                <div key={post.id} className="aspect-square relative group cursor-pointer overflow-hidden">
                  {post.image_url ? <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : (
                    <><img src={post.video_thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /><div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="w-10 h-10 text-white" /></div></>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="text-center py-20"><ImageIcon className="w-12 h-12 text-[#D9D5CE] mx-auto mb-4" /><h3 className="text-lg font-semibold text-[#141416]">No media yet</h3></div>}
        </TabsContent>

        <TabsContent value="articles" className="mt-0">
          {userArticles.length > 0 ? userArticles.map(post => (
            <article key={post.id} className="border-b border-[#D9D5CE] p-4">
              <h3 className="font-semibold text-lg text-[#141416] mb-2">{post.title}</h3>
              <p className="text-[#141416]">{post.content}</p>
            </article>
          )) : <div className="text-center py-20"><h3 className="text-lg font-semibold text-[#141416]">No articles yet</h3></div>}
        </TabsContent>

        <TabsContent value="videos" className="mt-0">
          {userVideos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 p-4">
              {userVideos.map(post => (
                <div key={post.id} className="relative rounded-xl overflow-hidden group cursor-pointer">
                  <img src={post.video_thumbnail || post.image_url} alt="" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="w-12 h-12 text-white" /></div>
                </div>
              ))}
            </div>
          ) : <div className="text-center py-20"><Play className="w-12 h-12 text-[#D9D5CE] mx-auto mb-4" /><h3 className="text-lg font-semibold text-[#141416]">No videos yet</h3></div>}
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          <div className="text-center py-20"><Heart className="w-12 h-12 text-[#D9D5CE] mx-auto mb-4" /><h3 className="text-lg font-semibold text-[#141416]">No likes yet</h3></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
