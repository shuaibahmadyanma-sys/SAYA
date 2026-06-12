import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  Bookmark,
  Check,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Verification Badge Component
function VerificationBadge({ level }: { level: string }) {
  if (level === 'none') return null;
  
  const badgeStyles: Record<string, string> = {
    blue: 'bg-blue-500',
    gold: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    grey: 'bg-gray-500',
    free: 'bg-gradient-to-br from-purple-500 to-pink-500',
  };

  return (
    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${badgeStyles[level] || 'bg-blue-500'} text-white text-[8px] ml-1`}>
      <Check className="w-2.5 h-2.5" />
    </span>
  );
}

interface PostWithAuthor {
  id: string;
  content: string;
  title: string | null;
  type: string;
  image_url: string | null;
  video_url: string | null;
  video_thumbnail: string | null;
  created_at: string;
  user_id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verification_level: string;
  };
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  views_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

function PostCard({ post, onLikeToggle, onBookmarkToggle }: { 
  post: PostWithAuthor; 
  onLikeToggle: (postId: string, currentLiked: boolean) => void;
  onBookmarkToggle: (postId: string, currentBookmarked: boolean) => void;
}) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <article className="border-b border-[#D9D5CE] p-4 hover:bg-[#E8E4DE]/30 transition-colors">
      <div className="flex gap-4">
        <Link to={`/profile/${post.author.username}`}>
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.author.avatar || ''} alt={post.author.name} />
            <AvatarFallback>{post.author.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            <Link to={`/profile/${post.author.username}`} className="font-semibold text-[#141416] hover:underline">
              {post.author.name}
            </Link>
            <VerificationBadge level={post.author.verification_level} />
            <span className="text-[#6E6A63]">@{post.author.username}</span>
            <span className="text-[#6E6A63]">·</span>
            <span className="text-[#6E6A63]">{formatDate(post.created_at)}</span>
          </div>

          {post.title && (
            <h3 className="font-semibold text-lg text-[#141416] mb-2">{post.title}</h3>
          )}
          <p className="text-[#141416] whitespace-pre-wrap mb-3">{post.content}</p>
          
          {post.image_url && (
            <img src={post.image_url} alt="Post" className="rounded-xl max-h-80 w-full object-cover mb-3" />
          )}
          
          {post.video_url && (
            <div className="relative rounded-xl overflow-hidden mb-3">
              <video 
                src={post.video_url}
                poster={post.video_thumbnail || undefined}
                className="w-full max-h-80 object-cover"
                controls
              />
            </div>
          )}

          <div className="flex items-center justify-between max-w-md">
            <button className="flex items-center gap-2 text-[#6E6A63] hover:text-[#B48C5A] transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-[#B48C5A]/10">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{formatNumber(post.comments_count)}</span>
            </button>

            <button className="flex items-center gap-2 text-[#6E6A63] hover:text-green-600 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-green-50">
                <Repeat2 className="w-5 h-5" />
              </div>
              <span className="text-sm">{formatNumber(post.reposts_count)}</span>
            </button>

            <button 
              onClick={() => onLikeToggle(post.id, post.is_liked)}
              className={`flex items-center gap-2 transition-colors group ${
                post.is_liked ? 'text-red-500' : 'text-[#6E6A63] hover:text-red-500'
              }`}
            >
              <div className={`p-2 rounded-full ${post.is_liked ? 'bg-red-50' : 'group-hover:bg-red-50'}`}>
                <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{formatNumber(post.likes_count)}</span>
            </button>

            <button 
              onClick={() => onBookmarkToggle(post.id, post.is_bookmarked)}
              className={`flex items-center gap-2 transition-colors group ${
                post.is_bookmarked ? 'text-[#B48C5A]' : 'text-[#6E6A63] hover:text-[#B48C5A]'
              }`}
            >
              <div className={`p-2 rounded-full ${post.is_bookmarked ? 'bg-[#B48C5A]/10' : 'group-hover:bg-[#B48C5A]/10'}`}>
                <Bookmark className={`w-5 h-5 ${post.is_bookmarked ? 'fill-current' : ''}`} />
              </div>
            </button>

            <button className="flex items-center gap-2 text-[#6E6A63] hover:text-[#B48C5A] transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-[#B48C5A]/10">
                <Share className="w-5 h-5" />
              </div>
            </button>
          </div>
          
          {post.views_count > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-[#6E6A63]">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(post.views_count)} views</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user's ID for like/bookmark checks
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Fetch posts with author info and counts
      const { data, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author:user_id(
            id,
            name,
            username,
            avatar,
            verification_level
          ),
          likes_count:likes(count),
          comments_count:comments(count),
          views_count:post_views(count)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      // Format posts and check if user liked/bookmarked
      const formattedPosts: PostWithAuthor[] = await Promise.all(
        (data || []).map(async (post: any) => {
          let isLiked = false;
          let isBookmarked = false;

          if (userId) {
            const [{ data: likeData }, { data: bookmarkData }] = await Promise.all([
              supabase.from('likes').select('id').eq('post_id', post.id).eq('user_id', userId).single(),
              supabase.from('bookmarks').select('id').eq('post_id', post.id).eq('user_id', userId).single(),
            ]);
            isLiked = !!likeData;
            isBookmarked = !!bookmarkData;
          }

          return {
            ...post,
            likes_count: post.likes_count?.[0]?.count ?? 0,
            comments_count: post.comments_count?.[0]?.count ?? 0,
            views_count: post.views_count?.[0]?.count ?? 0,
            reposts_count: 0,
            is_liked: isLiked,
            is_bookmarked: isBookmarked,
            author: post.author || { name: 'Unknown', username: 'unknown', avatar: '', verification_level: 'none' },
          };
        })
      );

      setPosts(formattedPosts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Toggle like on a post
  const handleLikeToggle = async (postId: string, currentlyLiked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (currentlyLiked) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id } as any);
        
        // Create notification
        const post = posts.find(p => p.id === postId);
        if (post && post.user_id !== user.id) {
          await supabase.from('notifications').insert({
            user_id: post.user_id,
            actor_id: user.id,
            type: 'like',
            target_id: postId,
            target_type: 'post',
          } as any);
        }
      }

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, is_liked: !currentlyLiked, likes_count: p.likes_count + (currentlyLiked ? -1 : 1) }
          : p
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Toggle bookmark on a post
  const handleBookmarkToggle = async (postId: string, currentlyBookmarked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (currentlyBookmarked) {
        await supabase.from('bookmarks').delete().eq('post_id', postId).eq('user_id', user.id);
      } else {
        await supabase.from('bookmarks').insert({ post_id: postId, user_id: user.id } as any);
      }

      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, is_bookmarked: !currentlyBookmarked } : p
      ));
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Subscribe to real-time post changes
  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('posts_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Compose Box */}
      <div className="border-b border-[#D9D5CE] p-4 bg-white">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profile?.avatar || ''} alt={profile?.name || ''} />
            <AvatarFallback>{profile?.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link to="/write">
              <div className="py-3 px-4 bg-[#F4F1EC] border border-[#D9D5CE] rounded-xl text-[#6E6A63] hover:border-[#B48C5A] transition-colors cursor-pointer">
                What's on your mind?
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPosts} variant="outline">Retry</Button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="space-y-4 p-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {!loading && !error && posts.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-[#6E6A63] text-lg">No posts yet.</p>
          <p className="text-[#6E6A63]">Be the first to share something!</p>
          <Link to="/write">
            <Button className="mt-4 bg-[#B48C5A] hover:bg-[#9a7550] text-white">
              Create Post
            </Button>
          </Link>
        </div>
      )}

      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ))}
    </div>
  );
}
