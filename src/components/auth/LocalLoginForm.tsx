import React, { useState } from 'react';
import { useLocalAuthStore } from '../../stores/localAuthStore';
import { UserCircle } from 'lucide-react';

export function LocalLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const login = useLocalAuthStore((state) => state.login);

  const handleLogin = async (name: string) => {
    try {
      setError(null);
      await login(name);
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="neu-card space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary via-accent to-gold p-1">
            <div className="w-full h-full rounded-full bg-neu-base flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-gold" />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-gold text-transparent bg-clip-text">
            Formidable Challenge
          </h2>
          <p className="text-text-secondary">Selecciona tu usuario para comenzar</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('PepeSimon')}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 px-6 rounded-xl 
                     hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200
                     border border-white/10"
          >
            Entrar como PepeSimon
          </button>
          <button
            onClick={() => handleLogin('Bigote Prime')}
            className="w-full bg-gradient-to-l from-primary to-accent text-white font-bold py-4 px-6 rounded-xl
                     hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200
                     border border-white/10"
          >
            Entrar como Bigote Prime
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}