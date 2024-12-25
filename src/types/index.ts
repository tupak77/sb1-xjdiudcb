import { ReactNode } from 'react';

export interface SupabaseUser {
  id: string;
  name: string;
  points: number;
  gold_buttons: number;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  points: number;
  medals: Medal[];
  goldButtons: number;
  interactions: Interaction[];
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface MedalDisplay {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
}

export interface Profile {
  id: string;
  name: string;
  points: number;
  medals?: Medal[];
  interactions: Array<{
    created_at: string;
  }>;
  lastGame?: Date | null;
}

export interface Interaction {
  id: string;
  type: 'lio' | 'chupachupa' | 'mandanga';
  points: number;
  date: string;
  target_user: string;
  bonuses: {
    raza: boolean;
    nationality: boolean;
    goldButton: boolean;
  };
}