import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';
import { navigationItems } from '../data/navigation';
import { MobileMenu } from './MobileMenu';
import { useAuthStore } from '../stores/authStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 p-4 transition-all duration-300 ${
      isScrolled ? 'bg-neu-base/95 backdrop-blur-sm shadow-lg' : 'bg-neu-base'
    }`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gold hover:scale-105 transition-transform">
            Formidable
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                    ${location.pathname === item.path 
                      ? 'neu-pressed text-gold' 
                      : 'neu-flat hover:scale-105'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="neu-button p-2"
                >
                  <User size={20} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-neu-base rounded-xl shadow-xl neu-card">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-primary/10"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="md:hidden p-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          user={user}
          onSignOut={signOut}
        />

        {/* Overlays */}
        {(isMobileMenuOpen || isUserMenuOpen) && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
          />
        )}
      </nav>
  );
}