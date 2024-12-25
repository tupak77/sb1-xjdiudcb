import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FancyInput } from '../components/FancyInput';
import { User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signUp, isSubmitting, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      await signUp(email, password, name);
      navigate('/');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <div className="neu-card">
          <h1 className="text-2xl font-bold text-center mb-6 gradient-text">
            Crear Cuenta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FancyInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre"
                required
                icon={<User className="text-text-secondary" />}
              />
            </div>

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
              <strong>{isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}</strong>
            </button>

            <p className="text-sm text-center text-text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-accent">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}