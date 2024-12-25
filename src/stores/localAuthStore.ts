import { create } from 'zustand';
import type { User, Interaction } from '../types';

interface LocalAuthState {
  users: User[];
  currentUser: User | null;
  addInteraction: (interaction: Omit<Interaction, 'id' | 'date'>) => void;
}

export const useLocalAuthStore = create<LocalAuthState>((set, get) => ({
  users: [],
  currentUser: null,
  addInteraction: (interaction) => {
    const state = get();
    if (!state.currentUser) return;

    const newInteraction = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      ...interaction
    };

    const updatedUser = {
      ...state.currentUser,
      points: state.currentUser.points + interaction.points,
      interactions: [newInteraction, ...state.currentUser.interactions]
    };

    set(state => ({
      users: state.users.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      ),
      currentUser: updatedUser
    }));
  }
}));