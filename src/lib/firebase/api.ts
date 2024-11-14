import { ref, set, get, update, remove, onValue, off, query, orderByChild, equalTo } from 'firebase/database';
import { db, auth } from './config';
import type { RealtimeWatchParty, User } from '../types/database';

export const firebaseApi = {
  watchParties: {
    create: async (partyId: string, hostId: string, initialData: Partial<RealtimeWatchParty>) => {
      const partyRef = ref(db, `watchParties/${partyId}`);
      const defaultData: RealtimeWatchParty = {
        currentTime: 0,
        isPlaying: false,
        participants: {
          [hostId]: {
            isOnline: true,
            lastSeen: Date.now(),
            hasVideo: false,
            hasAudio: false
          }
        },
        chat: {},
        sync: {
          timestamp: Date.now(),
          updatedBy: hostId
        }
      };

      await set(partyRef, { ...defaultData, ...initialData });
    },

    join: async (partyId: string, userId: string) => {
      const participantRef = ref(db, `watchParties/${partyId}/participants/${userId}`);
      await set(participantRef, {
        isOnline: true,
        lastSeen: Date.now(),
        hasVideo: false,
        hasAudio: false
      });
    },

    leave: async (partyId: string, userId: string) => {
      const participantRef = ref(db, `watchParties/${partyId}/participants/${userId}`);
      await remove(participantRef);
    },

    updateParticipantState: async (partyId: string, userId: string, updates: {
      isOnline?: boolean;
      hasVideo?: boolean;
      hasAudio?: boolean;
      isTyping?: boolean;
    }) => {
      const participantRef = ref(db, `watchParties/${partyId}/participants/${userId}`);
      await update(participantRef, {
        ...updates,
        lastSeen: Date.now()
      });
    },

    sendMessage: async (partyId: string, userId: string, content: string, type: 'text' | 'emoji' | 'system' = 'text') => {
      const chatRef = ref(db, `watchParties/${partyId}/chat/${Date.now()}`);
      await set(chatRef, {
        userId,
        content,
        type,
        timestamp: Date.now()
      });
    },

    sendReaction: async (partyId: string, userId: string, reactionType: string) => {
      const reactionRef = ref(db, `watchParties/${partyId}/reactions/${Date.now()}`);
      await set(reactionRef, {
        userId,
        type: reactionType,
        timestamp: Date.now()
      });
    },

    updatePlayback: async (partyId: string, userId: string, updates: {
      currentTime?: number;
      isPlaying?: boolean;
      playbackRate?: number;
    }) => {
      const playbackRef = ref(db, `watchParties/${partyId}/playback`);
      await update(playbackRef, {
        ...updates,
        updatedAt: Date.now(),
        updatedBy: userId
      });
    },

    updateSettings: async (partyId: string, settings: {
      syncMode?: 'host_only' | 'democratic';
      chatEnabled?: boolean;
      reactionsEnabled?: boolean;
    }) => {
      const settingsRef = ref(db, `watchParties/${partyId}/settings`);
      await update(settingsRef, settings);
    },

    subscribe: {
      toParty: (partyId: string, callback: (party: RealtimeWatchParty) => void) => {
        const partyRef = ref(db, `watchParties/${partyId}`);
        onValue(partyRef, (snapshot) => {
          callback(snapshot.val());
        });
        return () => off(partyRef);
      },

      toParticipants: (partyId: string, callback: (participants: RealtimeWatchParty['participants']) => void) => {
        const participantsRef = ref(db, `watchParties/${partyId}/participants`);
        onValue(participantsRef, (snapshot) => {
          callback(snapshot.val());
        });
        return () => off(participantsRef);
      },

      toChat: (partyId: string, callback: (messages: RealtimeWatchParty['chat']) => void) => {
        const chatRef = ref(db, `watchParties/${partyId}/chat`);
        onValue(chatRef, (snapshot) => {
          callback(snapshot.val());
        });
        return () => off(chatRef);
      },

      toPlayback: (partyId: string, callback: (playback: RealtimeWatchParty['playback']) => void) => {
        const playbackRef = ref(db, `watchParties/${partyId}/playback`);
        onValue(playbackRef, (snapshot) => {
          callback(snapshot.val());
        });
        return () => off(playbackRef);
      }
    }
  },

  users: {
    updateStatus: async (userId: string, status: 'online' | 'offline' | 'away') => {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        status,
        lastActive: Date.now()
      });
    },

    updatePreferences: async (userId: string, preferences: {
      notifications?: boolean;
      theme?: 'light' | 'dark';
    }) => {
      const preferencesRef = ref(db, `users/${userId}/preferences`);
      await update(preferencesRef, preferences);
    },

    subscribe: {
      toUser: (userId: string, callback: (user: User) => void) => {
        const userRef = ref(db, `users/${userId}`);
        onValue(userRef, (snapshot) => {
          callback(snapshot.val());
        });
        return () => off(userRef);
      },

      toOnlineUsers: (callback: (users: Record<string, User>) => void) => {
        const onlineUsersRef = query(
          ref(db, 'users'),
          orderByChild('status'),
          equalTo('online')
        );
        onValue(onlineUsersRef, (snapshot) => {
          callback(snapshot.val());
        });
        return () => off(onlineUsersRef);
      }
    }
  }
};