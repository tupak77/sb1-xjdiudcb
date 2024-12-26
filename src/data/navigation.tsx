import React from 'react';
import { Home, Info, Medal, History, User, MessageSquare } from 'lucide-react';

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
    label: 'Historial',
    icon: <History size={20} />
  },
  {
    path: '/chat',
    label: 'Chat',
    icon: <MessageSquare size={20} />
  },
  {
    path: '/profile',
    label: 'Perfil',
    icon: <User size={20} />
  }
];