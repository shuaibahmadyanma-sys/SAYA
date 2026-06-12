import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Hash,
  Globe,
  Lock,
  Users,
  Video,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, uploadFile } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function WritePage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [postType, setPostType] = useState<'thought' | 'article' | 'video'>('thought');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const charLimit = postType === 'article' ? 5000 : 1000;
  const charCount = content.length;
  const isValid = postType === 'article' ? title.trim() && content.trim() : content.trim();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    setIsVideo(type === 'video');
    if (type === 'video') setPostType('video');

    const reader = new FileReader();
    reader.onloadend = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setIsVideo(false);
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to post');
        return;
      }

      let imageUrl = null;
      let videoUrl = null;
      let videoThumbnail = null;

      // Upload media if present
      if (mediaFile) {
        const filePath = `posts/${user.id}/${Date.now()}_${mediaFile.name}`;
        const publicUrl = await uploadFile('saya-uploads', filePath, mediaFile);
        
        if (isVideo) {
          videoUrl = publicUrl;
          videoThumbnail = mediaPreview;
        } else {
          imageUrl = publicUrl;
        }
      }

      // Insert post into Supabase
      const { data: post, error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          title: title || null,
          type: postType,
          image_url: imageUrl,
          video_url: videoUrl,
          video_thumbnail: videoThumbnail,
        } as any)
        .select()
        .single();

      if (insertError) throw insertError;

      // Insert tags (optional - you'd need a post_tags table)
      if (tags.length > 0 && post) {
        // Tags can be stored in a separate table or parsed from content
        // For now, we'll just include them in the post content
      }

      // Navigate to feed
      navigate('/feed');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibilityOptions = {
    public: { icon: Globe, label: 'Everyone' },
    followers: { icon: Users, label: 'Followers only' },
    private: { icon: Lock, label: 'Only me' },
  };

  const VisibilityIcon = visibilityOptions[visibility].icon;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/feed" className="text-[#141416] hover:text-[#B48C5A] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display font-bold text-xl text-[#141416]">
              {postType === 'article' ? 'Write Article' : postType === 'video' ? 'Share Video' : 'New Post'}
            </h1>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-[#B48C5A] hover:bg-[#9a7550] text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Post Type Selector */}
      <div className="flex gap-2 p-4">
        <button
          onClick={() => { setPostType('thought'); setTitle(''); }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            postType === 'thought' ? 'bg-[#141416] text-[#F4F1EC]' : 'bg-white border border-[#D9D5CE] text-[#6E6A63]'
          }`}
        >
          Quick Thought
        </button>
        <button
          onClick={() => setPostType('article')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            postType === 'article' ? 'bg-[#141416] text-[#F4F1EC]' : 'bg-white border border-[#D9D5CE] text-[#6E6A63]'
          }`}
        >
          Article
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Composer */}
      <div className="mx-4 bg-white border border-[#D9D5CE] rounded-xl overflow-hidden">
        {/* User Info */}
        <div className="flex items-center gap-3 p-4 border-b border-[#D9D5CE]">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.avatar || ''} alt={profile?.name || ''} />
            <AvatarFallback>{profile?.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-[#141416]">{profile?.name || 'You'}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-[#6E6A63] hover:text-[#141416]">
                  <VisibilityIcon className="w-4 h-4" />
                  {visibilityOptions[visibility].label}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white border-[#D9D5CE]">
                <DropdownMenuItem onClick={() => setVisibility('public')}>
                  <Globe className="w-4 h-4 mr-2" /> Everyone
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisibility('followers')}>
                  <Users className="w-4 h-4 mr-2" /> Followers only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisibility('private')}>
                  <Lock className="w-4 h-4 mr-2" /> Only me
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title (for articles) */}
        {postType === 'article' && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full px-4 py-4 text-xl font-semibold text-[#141416] placeholder:text-[#6E6A63] bg-transparent border-b border-[#D9D5CE] outline-none"
          />
        )}

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={postType === 'article' ? "Write your article..." : "What's on your mind?"}
          className="w-full min-h-[200px] p-4 text-[#141416] placeholder:text-[#6E6A63] bg-transparent border-none outline-none resize-none"
        />

        {/* Media Preview */}
        {mediaPreview && (
          <div className="relative mx-4 mb-4 rounded-xl overflow-hidden">
            {isVideo ? (
              <video src={mediaPreview} className="w-full max-h-60 object-cover" controls />
            ) : (
              <img src={mediaPreview} alt="Preview" className="w-full max-h-60 object-cover" />
            )}
            <button 
              onClick={clearMedia}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tags */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge key={tag} className="bg-[#E8E4DE] text-[#141416] flex items-center gap-1 pr-1">
                #{tag}
                <button onClick={() => removeTag(tag)} className="p-0.5 hover:bg-[#D9D5CE] rounded">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#6E6A63]" />
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
              className="flex-1 text-sm text-[#141416] placeholder:text-[#6E6A63] bg-transparent border-none outline-none"
            />
          </div>
        </div>

        {/* Footer Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#D9D5CE] bg-[#F4F1EC]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-[#E8E4DE] text-[#6E6A63] hover:text-[#141416]"
              title="Add image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'image')}
            />

            <button 
              onClick={() => videoInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-[#E8E4DE] text-[#6E6A63] hover:text-[#141416]"
              title="Add video"
            >
              <Video className="w-5 h-5" />
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'video')}
            />
          </div>
          <span className={`text-sm ${charCount > charLimit ? 'text-red-500' : 'text-[#6E6A63]'}`}>
            {charCount}/{charLimit}
          </span>
        </div>
      </div>
    </div>
  );
}
