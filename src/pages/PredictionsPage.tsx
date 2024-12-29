import React, { useState, useEffect } from 'react';
import { Sparkles, Search, User, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { FancyInput } from '../components/FancyInput';
import type { Profile } from '../types';

interface Prediction {
  id: string;
  target_id: string;
  points: number;
  quarter: string;
  year: number;
  status: 'pending' | 'correct' | 'incorrect';
  created_at: string;
  target: Profile;
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function PredictionsPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [points, setPoints] = useState<string>('0');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, predictionsResponse] = await Promise.all([
        supabase.from('profiles').select('*').order('name'),
        supabase
          .from('predictions')
          .select('*, target:profiles!predictions_target_id_fkey(*)')
          .eq('predictor_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (predictionsResponse.error) throw predictionsResponse.error;

      setUsers(usersResponse.data);
      setPredictions(predictionsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pointsNumber = parseInt(points) || 0;
    if (!user || !selectedUser || pointsNumber < 0 || !selectedQuarter) return;

    try {
      setSubmitting(true);
      const year = new Date().getFullYear();
      
      const { error } = await supabase
        .from('predictions')
        .insert({
          predictor_id: user.id,
          target_id: selectedUser,
          points: pointsNumber,
          quarter: selectedQuarter,
          year
        });

      if (error) throw error;

      await fetchData();
      setSelectedUser('');
      setPoints('0');
      setSelectedQuarter('');
    } catch (error) {
      console.error('Error creating prediction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'incorrect':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="neu-card animate-pulse">
          <div className="h-8 bg-neu-dark rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-neu-dark rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="neu-card">
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2 mb-6">
            <Sparkles className="text-gold" />
            Predicciones
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Usuario
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-neu-base rounded-xl px-4 py-3 text-text-primary border border-white/10"
                required
              >
                <option value="">Selecciona un usuario</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Puntos Predichos
              </label>
              <FancyInput
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">
                Trimestre
              </label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="w-full bg-neu-base rounded-xl px-4 py-3 text-text-primary border border-white/10"
                required
              >
                <option value="">Selecciona un trimestre</option>
                {QUARTERS.map((quarter) => (
                  <option key={quarter} value={quarter}>
                    {quarter}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedQuarter}
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
                {submitting ? 'GUARDANDO...' : 'GUARDAR PREDICCIÓN'}
              </strong>
            </button>
          </form>
        </div>

        <div className="neu-card">
          <h2 className="text-xl font-bold gradient-text mb-6">
            Historial de Predicciones
          </h2>

          <div className="space-y-4">
            {predictions.length === 0 ? (
              <p className="text-center text-text-secondary py-4">
                No hay predicciones registradas
              </p>
            ) : (
              predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="neu-element p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent p-0.5">
                      <div className="w-full h-full rounded-full bg-neu-base flex items-center justify-center">
                        <User className="w-5 h-5 text-gold" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{prediction.target.name}</p>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        {prediction.quarter} {prediction.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusIcon(prediction.status)}
                    <span className="font-bold gradient-text">
                      {prediction.points} pts
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}