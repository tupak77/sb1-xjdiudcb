import { create } from 'zustand';
import type { ChatState, ChatMessage, ChatRoom, ChatParticipant, UserStatus } from '../types/chat';

interface ChatStore extends ChatState {
  setActiveRoom: (roomId: string | null) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  setRooms: (rooms: ChatRoom[]) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  setParticipants: (roomId: string, participants: ChatParticipant[]) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  activeRoom: null,
  rooms: [],
  messages: {},
  participants: {},
  userStatuses: {},
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }
    })),
  setRooms: (rooms) => set({ rooms }),
  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }
    })),
  setParticipants: (roomId, participants) =>
    set((state) => ({
      participants: {
        ...state.participants,
        [roomId]: participants
      }
    })),
  updateUserStatus: (userId, status) =>
    set((state) => ({
      userStatuses: {
        ...state.userStatuses,
        [userId]: status
      }
    }))
}));