import { supabase } from './config';
import type { Database } from './types';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type WatchParty = Tables['watch_parties']['Row'];

export const supabaseApi = {
  // Autenticação
  auth: {
    signUp: async (email: string, password: string, username: string) => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Criar perfil do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user!.id,
          username,
          notification_preferences: { email: true, push: true },
        })
        .select()
        .single();

      if (userError) throw userError;
      return userData;
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  },

  // Usuários
  users: {
    getProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },

    updateProfile: async (userId: string, updates: Partial<User>) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  },

  // Watch Parties
  watchParties: {
    create: async (watchParty: Omit<Tables['watch_parties']['Insert'], 'id'>) => {
      const { data, error } = await supabase
        .from('watch_parties')
        .insert(watchParty)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    get: async (id: string) => {
      const { data, error } = await supabase
        .from('watch_parties')
        .select(`
          *,
          host:users!watch_parties_host_id_fkey(id, username, avatar_url),
          participants:user_watch_parties(
            user:users(id, username, avatar_url),
            role,
            is_active
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },

    list: async (filters?: {
      status?: WatchParty['status'];
      isPrivate?: boolean;
      hostId?: string;
    }) => {
      let query = supabase
        .from('watch_parties')
        .select(`
          *,
          host:users!watch_parties_host_id_fkey(id, username, avatar_url),
          participants:user_watch_parties(
            user:users(id, username, avatar_url)
          )
        `);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.isPrivate !== undefined) {
        query = query.eq('is_private', filters.isPrivate);
      }
      if (filters?.hostId) {
        query = query.eq('host_id', filters.hostId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    update: async (id: string, updates: Partial<WatchParty>) => {
      const { data, error } = await supabase
        .from('watch_parties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    join: async (watchPartyId: string, userId: string, role: 'participant' | 'moderator' = 'participant') => {
      const { data, error } = await supabase
        .from('user_watch_parties')
        .insert({
          user_id: userId,
          watch_party_id: watchPartyId,
          role,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    leave: async (watchPartyId: string, userId: string) => {
      const { error } = await supabase
        .from('user_watch_parties')
        .delete()
        .eq('watch_party_id', watchPartyId)
        .eq('user_id', userId);
      
      if (error) throw error;
    },
  },

  // Ratings
  ratings: {
    create: async (rating: {
      user_id: string;
      watch_party_id: string;
      rating: number;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from('ratings')
        .insert(rating)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    getForWatchParty: async (watchPartyId: string) => {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          user:users(id, username, avatar_url)
        `)
        .eq('watch_party_id', watchPartyId);
      
      if (error) throw error;
      return data;
    },
  },
};