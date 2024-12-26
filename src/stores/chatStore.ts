import { create } from 'zustand';
import type { ChatState } from '../types/chat';

export const useChatStore = create<ChatState>((set) => ({
  activeRoom: null,
  rooms: [],
  messages: {},
  participants: {},
  userStatuses: {},
  setActiveRoom: (roomId: string | null) => set({ activeRoom: roomId }),
  addMessage: (roomId: string, message: ChatMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message]
      }
    })),
  setRooms: (rooms: ChatRoom[]) => set({ rooms }),
  setMessages: (roomId: string, messages: ChatMessage[]) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages
      }
    })),
  setParticipants: (roomId: string, participants: ChatParticipant[]) =>
    set((state) => ({
      participants: {
        ...state.participants,
        [roomId]: participants
      }
    })),
  updateUserStatus: (userId: string, status: UserStatus) =>
    set((state) => ({
      userStatuses: {
        ...state.userStatuses,
        [userId]: status
      }
    }))
}));