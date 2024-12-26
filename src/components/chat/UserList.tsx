import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { chatService } from '../../lib/chat';
import { User, MessageSquare } from 'lucide-react';

interface UserListProps {
  className?: string;
}

export function UserList({ className = '' }: UserListProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { userStatuses, rooms } = useChatStore();

  const handleUserClick = async (userId: string) => {
    if (!currentUser) return;
    const roomId = await chatService.createDirectChat(currentUser, userId);
    useChatStore.getState().setActiveRoom(roomId);
  };

  useEffect(() => {
    const subscription = chatService.subscribeToUserStatus((status) => {
      useChatStore.getState().updateUserStatus(status.user_id, status);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Conversaciones
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {Object.entries(userStatuses).map(([userId, status]) => (
          <button
            key={userId}
            onClick={() => handleUserClick(userId)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-neu-dark flex items-center justify-center">
                <User className="w-5 h-5 text-text-secondary" />
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neu-base
                  ${status.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{userId}</p>
              <p className="text-sm text-text-secondary">
                {status.status === 'online' ? 'En línea' : 'Desconectado'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}