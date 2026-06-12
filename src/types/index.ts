export type VerificationLevel = 'none' | 'blue' | 'gold' | 'grey' | 'free';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
  verificationLevel: VerificationLevel;
  role: 'reader' | 'writer' | 'thinker' | 'pro';
  location?: string;
  website?: string;
  joinedDate: string;
  coverImage?: string;
  isPremium?: boolean;
  premiumExpiry?: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  title?: string;
  excerpt?: string;
  image?: string;
  video?: string;
  videoThumbnail?: string;
  createdAt: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  isReposted: boolean;
  tags: string[];
  type: 'thought' | 'article' | 'question' | 'video';
  views?: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

export interface Question {
  id: string;
  author: User;
  title: string;
  content: string;
  createdAt: string;
  answers: Answer[];
  tags: string[];
  views: number;
  followers: number;
}

export interface Answer {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  upvotes: number;
  isUpvoted: boolean;
  isAccepted: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'repost' | 'mention';
  actor: User;
  target?: Post | Question;
  content?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  followers: number;
  posts: number;
  image?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  video?: string;
  videoThumbnail?: string;
  author: User;
  source?: string;
  publishedAt: string;
  category: 'breaking' | 'tech' | 'business' | 'culture' | 'science';
  tags: string[];
  views: number;
}

export interface UserSettings {
  account: {
    username: string;
    email: string;
    phone?: string;
    password: string;
  };
  privacy: {
    isPrivate: boolean;
    showLocation: boolean;
    showActivity: boolean;
    allowTagging: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
  };
  notifications: {
    email: boolean;
    push: boolean;
    mentions: boolean;
    follows: boolean;
    likes: boolean;
    reposts: boolean;
    messages: boolean;
    news: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    reduceMotion: boolean;
  };
  content: {
    language: string;
    sensitiveContent: boolean;
    autoplayVideos: boolean;
    showTrending: boolean;
  };
}
