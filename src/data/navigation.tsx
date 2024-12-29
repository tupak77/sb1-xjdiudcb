import React from 'react';
import { Home, Info, Medal, Trophy, MessageSquare, Sparkles } from 'lucide-react';

export const navigationItems = [
  {
    path: '/',
    label: 'Panel',
    icon: <Home size={20} />
  },
  {
    path: '/info',
    label: 'Info',
    icon: <Info size={20} />
  },
  {
    path: '/medals',
    label: 'Medallas',
    icon: <Medal size={20} />
  },
  {
    path: '/history',
    label: 'Ranking',
    icon: <Trophy size={20} />
  },
  {
    path: '/chat',
    label: 'Chat',
    icon: <MessageSquare size={20} />
  },
  {
    path: '/predictions',
    label: 'Predicciones',
    icon: <Sparkles size={20} />
  }
];