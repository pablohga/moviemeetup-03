import { ref, set, onValue, off, update, remove } from 'firebase/database';
import { db } from './config';

// Estrutura de dados em tempo real para watch parties
interface RealtimeWatchParty {
  currentTime: number;
  isPlaying: boolean;
  playbackRate: number;
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
  reactions: {
    [reactionId: string]: {
      userId: string;
      type: string;
      timestamp: number;
    };
  };
  sync: {
    timestamp: number;
    updatedBy: string;
    seekTarget?: number;
  };
}

export class WatchPartyRealtime {
  private partyRef;
  
  constructor(partyId: string) {
    this.partyRef = ref(db, `watchParties/${partyId}`);
  }

  // Inicializar watch party
  async initialize(hostId: string) {
    const initialData: RealtimeWatchParty = {
      currentTime: 0,
      isPlaying: false,
      playbackRate: 1,
      participants: {
        [hostId]: {
          isOnline: true,
          lastSeen: Date.now(),
          hasVideo: false,
          hasAudio: false
        }
      },
      chat: {},
      reactions: {},
      sync: {
        timestamp: Date.now(),
        updatedBy: hostId
      }
    };

    await set(this.partyRef, initialData);
  }

  // Atualizar estado do participante
  async updateParticipantState(userId: string, state: Partial<RealtimeWatchParty['participants'][string]>) {
    const participantRef = ref(db, `watchParties/${this.partyRef.key}/participants/${userId}`);
    await update(participantRef, {
      ...state,
      lastSeen: Date.now()
    });
  }

  // Enviar mensagem no chat
  async sendChatMessage(userId: string, content: string, type: 'text' | 'emoji' | 'system' = 'text') {
    const messageRef = ref(db, `watchParties/${this.partyRef.key}/chat/${Date.now()}`);
    await set(messageRef, {
      userId,
      content,
      type,
      timestamp: Date.now()
    });
  }

  // Atualizar estado de reprodução
  async updatePlaybackState(userId: string, state: { currentTime?: number; isPlaying?: boolean; playbackRate?: number }) {
    await update(this.partyRef, {
      ...state,
      sync: {
        timestamp: Date.now(),
        updatedBy: userId,
        seekTarget: state.currentTime
      }
    });
  }

  // Enviar reação
  async sendReaction(userId: string, reactionType: string) {
    const reactionRef = ref(db, `watchParties/${this.partyRef.key}/reactions/${Date.now()}`);
    await set(reactionRef, {
      userId,
      type: reactionType,
      timestamp: Date.now()
    });
  }

  // Escutar mudanças na watch party
  onStateChange(callback: (state: RealtimeWatchParty) => void) {
    onValue(this.partyRef, (snapshot) => {
      callback(snapshot.val() as RealtimeWatchParty);
    });
  }

  // Remover listeners
  cleanup() {
    off(this.partyRef);
  }
}

// Hook personalizado para watch party em tempo real
export function useWatchPartyRealtime(partyId: string) {
  return new WatchPartyRealtime(partyId);
}