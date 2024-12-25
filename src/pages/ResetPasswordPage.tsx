import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FancyInput } from '../components/FancyInput';
import { Mail } from 'lucide-react';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Error is handled by the store
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="neu-card text-center">
            <h1 className="text-2xl font-bold mb-4 gradient-text">
              Correo Enviado
            </h1>
            <p className="text-text-secondary mb-6">
              Si existe una cuenta con ese email, recibirás un enlace para
              restablecer tu contraseña.
            </p>
            <Link
              to="/login"
              className="inline-block text-primary hover:text-accent"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <div className="neu-card">
          <h1 className="text-2xl font-bold text-center mb-6 gradient-text">
            Restablecer Contraseña
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

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full animated-button"
            >
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
              <strong>
                {loading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
              </strong>
            </button>

            <p className="text-sm text-center text-text-secondary">
              <Link to="/login" className="text-primary hover:text-accent">
                Volver al inicio de sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}