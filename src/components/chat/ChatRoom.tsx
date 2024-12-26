import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { chatService } from '../../lib/chat';
import { MessageInput } from './MessageInput';
import { User, Users } from 'lucide-react';

interface ChatRoomProps {
  roomId: string;
  className?: string;
}

export function ChatRoom({ roomId, className = '' }: ChatRoomProps) {
  const currentUser = useAuthStore((state) => state.user);
  const messages = useChatStore((state) => state.messages[roomId] || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const messages = await chatService.getMessages(roomId);
      useChatStore.getState().setMessages(roomId, messages.reverse());
    };

    loadMessages();

    const subscription = chatService.subscribeToRoom(roomId, (payload) => {
      const message = payload.new;
      useChatStore.getState().addMessage(roomId, message);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-gold" />
          Chat Grupal
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender_id === currentUser?.id ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-neu-dark flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-text-secondary" />
            </div>
            <div
              className={`max-w-[70%] p-3 rounded-xl ${
                message.sender_id === currentUser?.id
                  ? 'bg-primary/20 ml-auto'
                  : 'bg-white/5'
              }`}
            >
              <p className="text-sm text-text-secondary">
                {message.sender?.name || 'Usuario'}
              </p>
              <p className="mt-1">{message.content}</p>
              <p className="text-xs text-text-secondary mt-1">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={async (content) => {
          if (!currentUser) return;
          await chatService.sendMessage(roomId, currentUser.id, content);
        }}
      />
    </div>
  );
}