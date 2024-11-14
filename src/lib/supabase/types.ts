export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          bio: string | null
          favorite_genres: string[] | null
          social_links: Json | null
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          favorite_genres?: string[] | null
          social_links?: Json | null
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          favorite_genres?: string[] | null
          social_links?: Json | null
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      watch_parties: {
        Row: {
          id: string
          title: string
          description: string | null
          media_type: 'movie' | 'series' | 'game'
          media_title: string
          media_cover_url: string | null
          media_duration: number | null
          host_id: string
          is_private: boolean
          scheduled_for: string
          max_participants: number | null
          status: 'scheduled' | 'active' | 'ended' | 'cancelled'
          video_room_id: string | null
          chat_enabled: boolean
          reactions_enabled: boolean
          sync_mode: 'host_only' | 'democratic'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          media_type: 'movie' | 'series' | 'game'
          media_title: string
          media_cover_url?: string | null
          media_duration?: number | null
          host_id: string
          is_private?: boolean
          scheduled_for: string
          max_participants?: number | null
          status?: 'scheduled' | 'active' | 'ended' | 'cancelled'
          video_room_id?: string | null
          chat_enabled?: boolean
          reactions_enabled?: boolean
          sync_mode?: 'host_only' | 'democratic'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          media_type?: 'movie' | 'series' | 'game'
          media_title?: string
          media_cover_url?: string | null
          media_duration?: number | null
          host_id?: string
          is_private?: boolean
          scheduled_for?: string
          max_participants?: number | null
          status?: 'scheduled' | 'active' | 'ended' | 'cancelled'
          video_room_id?: string | null
          chat_enabled?: boolean
          reactions_enabled?: boolean
          sync_mode?: 'host_only' | 'democratic'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}