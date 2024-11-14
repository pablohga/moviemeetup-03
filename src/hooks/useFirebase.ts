import { useEffect, useCallback } from 'react';
import { firebaseApi } from '../lib/firebase/api';
import { useAuth } from '../context/AuthContext';

export function useFirebase() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Atualizar status do usuário quando conectado
    firebaseApi.users.updateStatus(user.id, 'online');

    // Configurar listener de desconexão
    const unsubscribe = firebaseApi.users.subscribe.toUser(user.id, (userData) => {
      if (userData?.status === 'offline') {
        firebaseApi.users.updateStatus(user.id, 'online');
      }
    });

    // Limpar status quando desconectar
    return () => {
      unsubscribe();
      if (user) {
        firebaseApi.users.updateStatus(user.id, 'offline');
      }
    };
  }, [user]);

  const joinWatchParty = useCallback(async (partyId: string) => {
    if (!user) return;
    await firebaseApi.watchParties.join(partyId, user.id);
  }, [user]);

  const leaveWatchParty = useCallback(async (partyId: string) => {
    if (!user) return;
    await firebaseApi.watchParties.leave(partyId, user.id);
  }, [user]);

  const sendMessage = useCallback(async (partyId: string, content: string, type: 'text' | 'emoji' | 'system' = 'text') => {
    if (!user) return;
    await firebaseApi.watchParties.sendMessage(partyId, user.id, content, type);
  }, [user]);

  const sendReaction = useCallback(async (partyId: string, reactionType: string) => {
    if (!user) return;
    await firebaseApi.watchParties.sendReaction(partyId, user.id, reactionType);
  }, [user]);

  const updatePlayback = useCallback(async (partyId: string, updates: {
    currentTime?: number;
    isPlaying?: boolean;
    playbackRate?: number;
  }) => {
    if (!user) return;
    await firebaseApi.watchParties.updatePlayback(partyId, user.id, updates);
  }, [user]);

  return {
    api: firebaseApi,
    joinWatchParty,
    leaveWatchParty,
    sendMessage,
    sendReaction,
    updatePlayback
  };
}