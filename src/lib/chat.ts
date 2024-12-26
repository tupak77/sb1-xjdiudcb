import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import type { ChatMessage } from '../types/chat';

export const chatService = {
  async sendMessage(roomId: string, senderId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        content: content.trim()
      });
    
    if (error) {
      console.error('Error sending message:', error);
      throw new Error('Error al enviar el mensaje');
    }
  },

  async getMessages(roomId: string, limit = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Error al cargar los mensajes');
    }

    return data || [];
  },

  subscribeToRoom(roomId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        callback
      )
      .subscribe();
  }
};