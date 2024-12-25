import React from 'react';
import { X, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navigationItems } from '../data/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  onSignOut: () => Promise<void>;
}

export function MobileMenu({ isOpen, onClose, user, onSignOut }: MobileMenuProps) {
  const location = useLocation();
  
  return (
    <div className={`
      fixed inset-y-0 right-0 w-64 bg-neu-base transform transition-transform duration-300 ease-in-out z-50
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-4">
        <button 
          onClick={onClose}
          className="p-2 hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>
        
        <nav className="mt-8">
          <ul className="space-y-4">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                    ${location.pathname === item.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-primary/5'}`}
                  onClick={onClose}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {user && (
          <div className="mt-8 border-t border-white/10 pt-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5"
              onClick={onClose}
            >
              <User size={20} />
              <span className="font-medium">Perfil</span>
            </Link>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/5 text-red-500"
            >
              <LogOut size={20} />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}