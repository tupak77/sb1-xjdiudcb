import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { User, Trophy, Calendar, Star, Pencil, Check, X } from 'lucide-react';
import { UserMedals } from '../components/medals/UserMedals';
import { FancyInput } from '../components/FancyInput';
import type { Medal } from '../types';
import { medals as availableMedals } from '../data/medals';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [points, setPoints] = useState(0);
  const [userMedals, setUserMedals] = useState<Medal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPoints();
      fetchMedals();
      setNewName(user.user_metadata.name || '');
    }
  }, [user?.id]);

  const fetchMedals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('medals')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const medals = data.map(medal => {
        const medalInfo = availableMedals.find(m => m.id === medal.medal_id);
        return {
          id: medal.medal_id,
          name: medalInfo?.name || '',
          description: medal.description || medalInfo?.description || '',
          icon: '',
          unlocked: true
        };
      });

      setUserMedals(medals);
    } catch (error) {
      console.error('Error fetching medals:', error);
    }
  };

  const fetchPoints = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching points:', error);
      return;
    }

    setPoints(data?.points || 0);
  };

  const handleUpdateName = async () => {
    if (!user || !newName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: newName.trim() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: newName.trim() }
      });

      if (metadataError) throw metadataError;

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el nombre');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <div className="neu-card space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent p-1">
              <div className="w-full h-full rounded-full bg-neu-base flex items-center justify-center">
                <User className="w-8 h-8 text-gold" />
              </div>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <FancyInput
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateName}
                      disabled={isSubmitting}
                      className="neu-button text-green-500 hover:text-green-400"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewName(user.user_metadata.name || '');
                        setError(null);
                      }}
                      className="neu-button text-red-500 hover:text-red-400"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold gradient-text">
                    {user.user_metadata.name || 'Usuario'}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <Pencil size={16} className="text-text-secondary" />
                  </button>
                </div>
              )}
              <p className="text-text-secondary">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="neu-pressed p-4 rounded-xl flex items-center gap-3">
              <Trophy className="text-gold" />
              <div>
                <p className="text-text-secondary">Puntos totales</p>
                <p className="text-lg font-bold gradient-text">{points}</p>
              </div>
            </div>
            <div className="neu-pressed p-4 rounded-xl flex items-center gap-3">
              <Star className="text-gold" />
              <div>
                <p className="text-text-secondary">Medallas</p>
                <p className="text-lg font-bold gradient-text">
                  {userMedals.length}
                </p>
              </div>
            </div>
            <div className="neu-pressed p-4 rounded-xl flex items-center gap-3">
              <Calendar className="text-gold" />
              <div>
                <p className="text-text-secondary">Miembro desde</p>
                <p className="text-lg font-bold">
                  {new Date(user.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="neu-card">
          <UserMedals userMedals={userMedals} onUpdate={fetchMedals} />
        </div>
      </div>
    </div>
  );
}