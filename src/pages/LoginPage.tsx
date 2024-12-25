import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FancyInput } from '../components/FancyInput';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isSubmitting, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <div className="neu-card">
          <h1 className="text-2xl font-bold text-center mb-6 gradient-text">
            Iniciar Sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FancyInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon={<Mail className="text-text-secondary" />}
              />
            </div>

            <div>
              <FancyInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                icon={<Lock className="text-text-secondary" />}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full animated-button"
            >
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
              <strong>{isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}</strong>
            </button>

            <div className="text-center space-y-2">
              <Link
                to="/reset-password"
                className="text-sm text-text-secondary hover:text-primary"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <p className="text-sm text-text-secondary">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary hover:text-accent">
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}