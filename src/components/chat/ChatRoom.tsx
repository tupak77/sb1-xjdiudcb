import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { chatService } from '../../lib/chat';
import MessageInput from './MessageInput';
import { User, Users } from 'lucide-react';

const ChatMessage = memo(({ message, isOwnMessage, currentUser }) => (
  <div
    className={`flex gap-3 ${
      isOwnMessage ? 'flex-row-reverse' : ''
    }`}
  >
    <div className="w-8 h-8 rounded-full bg-neu-dark flex items-center justify-center flex-shrink-0">
      <User className="w-4 h-4 text-text-secondary" />
    </div>
    <div
      className={`max-w-[70%] p-3 rounded-xl ${
        isOwnMessage
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
));

interface ChatRoomProps {
  roomId: string;
  className?: string;
}

export function ChatRoom({ roomId, className = '' }: ChatRoomProps) {
  const currentUser = useAuthStore((state) => state.user);
  const messages = useChatStore((state) => state.messages[roomId] || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    setIsAtBottom(Math.abs(scrollHeight - scrollTop - clientHeight) < 50);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAtBottom]);

  useEffect(() => {
    let subscription: any;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const messages = await chatService.getMessages(roomId);
        useChatStore.getState().setMessages(roomId, messages);
        
        // Subscribe to new messages
        subscription = chatService.subscribeToRoom(roomId, (message) => {
          useChatStore.getState().addMessage(roomId, message);
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [roomId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-gold" />
          Chat Grupal
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" onScroll={handleScroll}>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.sender_id === currentUser?.id}
              currentUser={currentUser}
            />
          ))
        )}
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