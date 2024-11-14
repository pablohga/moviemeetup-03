// Supabase Tables
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  status?: 'online' | 'offline' | 'away';
  lastActive?: number;
}

export interface WatchParty {
  id: string;
  title: string;
  description: string;
  media_type: 'movie' | 'series' | 'game';
  media_title: string;
  media_cover_url?: string;
  host_id: string;
  is_private: boolean;
  scheduled_for: string;
  status: 'scheduled' | 'active' | 'ended';
  created_at: string;
  updated_at: string;
}

// Firebase Realtime Database
export interface RealtimeWatchParty {
  currentTime: number;
  isPlaying: boolean;
  participants: {
    [userId: string]: {
      isOnline: boolean;
      lastSeen: number;
      hasVideo: boolean;
      hasAudio: boolean;
      isTyping?: boolean;
    };
  };
  chat: {
    [messageId: string]: {
      userId: string;
      content: string;
      timestamp: number;
      type: 'text' | 'emoji' | 'system';
    };
  };
  reactions?: {
    [reactionId: string]: {
      userId: string;
      type: string;
      timestamp: number;
    };
  };
  playback?: {
    currentTime: number;
    isPlaying: boolean;
    playbackRate: number;
    updatedAt: number;
    updatedBy: string;
  };
  settings?: {
    syncMode: 'host_only' | 'democratic';
    chatEnabled: boolean;
    reactionsEnabled: boolean;
  };
  sync: {
    timestamp: number;
    updatedBy: string;
  };
}