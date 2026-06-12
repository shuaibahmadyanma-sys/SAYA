export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          username?: string | null;
          avatar?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          cover_image?: string | null;
          verification_level?: 'none' | 'blue' | 'gold' | 'grey' | 'free';
          role?: 'reader' | 'writer' | 'thinker' | 'pro';
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          username?: string | null;
          avatar?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          cover_image?: string | null;
          verification_level?: 'none' | 'blue' | 'gold' | 'grey' | 'free';
          role?: 'reader' | 'writer' | 'thinker' | 'pro';
          is_premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          title: string | null;
          type: 'thought' | 'article' | 'video';
          image_url: string | null;
          video_url: string | null;
          video_thumbnail: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          title?: string | null;
          type?: 'thought' | 'article' | 'video';
          image_url?: string | null;
          video_url?: string | null;
          video_thumbnail?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          title?: string | null;
          type?: 'thought' | 'article' | 'video';
          image_url?: string | null;
          video_url?: string | null;
          video_thumbnail?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversation_participants: {
        Row: {
          conversation_id: string;
          user_id: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string;
          type: string;
          target_id: string | null;
          target_type: string | null;
          content: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          actor_id: string;
          type: string;
          target_id?: string | null;
          target_type?: string | null;
          content?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          actor_id?: string;
          type?: string;
          target_id?: string | null;
          target_type?: string | null;
          content?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
        };
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          user_id: string;
          content: string;
          is_accepted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          user_id: string;
          content: string;
          is_accepted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          user_id?: string;
          content?: string;
          is_accepted?: boolean;
          created_at?: string;
        };
      };
      answer_votes: {
        Row: {
          id: string;
          answer_id: string;
          user_id: string;
          is_upvote: boolean;
        };
        Insert: {
          id?: string;
          answer_id: string;
          user_id: string;
          is_upvote?: boolean;
        };
        Update: {
          id?: string;
          answer_id?: string;
          user_id?: string;
          is_upvote?: boolean;
        };
      };
      topics: {
        Row: {
          id: string;
          name: string;
          description: string;
          image: string | null;
          followers_count: number;
          posts_count: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image?: string | null;
          followers_count?: number;
          posts_count?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image?: string | null;
          followers_count?: number;
          posts_count?: number;
        };
      };
    };
  };
}
