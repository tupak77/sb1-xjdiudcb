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
      .select('*, sender:profiles!chat_messages_sender_id_fkey(id, name, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Error al cargar los mensajes');
    }

    return data || [];
  },

  subscribeToRoom(roomId: string, onMessage: (message: ChatMessage) => void) {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (newMessage.sender) {
            onMessage(newMessage);
          } else {
            // Fetch complete message data if sender info is missing
            supabase
              .from('chat_messages')
              .select('*, sender:profiles!chat_messages_sender_id_fkey(id, name, avatar_url)')
              .eq('id', newMessage.id)
              .single()
              .then(({ data, error }) => {
                if (!error && data) {
                  onMessage(data);
                }
              });
          }
        }
      )
      .subscribe();
      
    return channel;
  }
};