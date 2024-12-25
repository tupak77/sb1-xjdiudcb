import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { User, Trophy, Calendar, Star } from 'lucide-react';
import { UserMedals } from '../components/medals/UserMedals';
import type { Medal } from '../types';
import { medals as availableMedals } from '../data/medals';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [points, setPoints] = useState(0);
  const [userMedals, setUserMedals] = useState<Medal[]>([]);

  useEffect(() => {
    if (user) {
      fetchPoints();
      fetchMedals();
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
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                {user.user_metadata.name || 'Usuario'}
              </h1>
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