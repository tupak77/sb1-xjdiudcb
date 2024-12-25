import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { BatmanButton } from '../components/BatmanButton';
import { AddMedalModal } from '../components/medals/AddMedalModal';
import Leaderboard from '../components/Leaderboard';
import { InteractionModal } from '../components/interactions/InteractionModal';
import { LogOut, Trophy, Target, Award, Pencil, Medal } from 'lucide-react';
import type { Interaction } from '../types';
import '../styles/batman-button.css';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [points, setPoints] = useState<number>(0);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchInteractions();
      fetchPoints();
    }
  }, [user]);

  const fetchInteractions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
      return;
    }

    setInteractions(data || []);
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

  const handleNewInteraction = async (interaction: Omit<Interaction, 'id' | 'date'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .insert({
          user_id: user.id,
          type: interaction.type,
          target_user: interaction.target_user,
          points: interaction.points,
          has_raza: interaction.bonuses.raza,
          has_nationality: interaction.bonuses.nationality,
          used_gold_button: interaction.bonuses.goldButton
        });

      if (error) throw error;

      // Refresh data
      await Promise.all([
        fetchInteractions(),
        fetchPoints()
      ]);

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding interaction:', error);
      alert('Error al guardar la interacción');
    }
  };

  const handleEditInteraction = async (interaction: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('interactions')
        .update({
          type: interaction.type,
          target_user: interaction.target_user,
          points: interaction.points,
          has_raza: interaction.bonuses.raza,
          has_nationality: interaction.bonuses.nationality,
          used_gold_button: interaction.bonuses.goldButton
        })
        .eq('id', editingInteraction.id);

      if (error) throw error;

      await Promise.all([
        fetchInteractions(),
        fetchPoints()
      ]);

      setIsModalOpen(false);
      setEditingInteraction(null);
    } catch (error) {
      console.error('Error updating interaction:', error);
      alert('Error al actualizar la interacción');
    }
  };

  const handleAddMedal = async (medalData: { medalId: string; date: string; description: string }) => {
    if (!user) return;

    // Check if medal already exists without using .single()
    const { data: existingMedals, error: checkError } = await supabase
      .from('medals')
      .select('id')
      .eq('user_id', user.id)
      .eq('medal_id', medalData.medalId);

    if (checkError) {
      console.error('Error checking existing medal:', checkError);
      throw new Error('Error al verificar la medalla');
    }

    if (existingMedals && existingMedals.length > 0) {
      throw new Error('Ya tienes esta medalla');
    }

    try {
      const { error } = await supabase
        .from('medals')
        .insert({
          user_id: user.id,
          medal_id: medalData.medalId,
          description: medalData.description,
          unlocked_at: medalData.date
        });

      if (error) throw error;
      
      // Could add a success message here
    } catch (error) {
      console.error('Error adding medal:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold gradient-text flex items-center gap-2">
          <Trophy className="text-gold" />
          Panel de Control
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="neu-card space-y-6">
            <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Trophy className="text-gold" />
              Historial de Interacciones
            </h2>
            <div className="space-y-4">
              {interactions.map((interaction) => (
                <div key={interaction.id} className="neu-element p-4">
                  <div className="flex justify-between items-center group">
                    <div>
                      <p className="font-semibold capitalize">{interaction.type}</p>
                      <p className="text-sm text-text-secondary">
                        Con: {interaction.target_user}
                      </p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <button
                        onClick={() => {
                          setEditingInteraction(interaction);
                          setIsModalOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                      <p className="text-lg font-bold text-gold">
                        {interaction.points} pts
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(interaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {interactions.length === 0 && (
                <p className="text-center text-text-secondary py-4">
                  No hay interacciones registradas
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="neu-card hover:scale-[1.02] transition-transform">
            <h2 className="text-xl font-bold mb-6 gradient-text flex items-center gap-2">
              <Target className="text-gold" />
              Registrar Interacción
            </h2>
            <div className="flex justify-center">
              <BatmanButton onClick={() => setIsModalOpen(true)}>
                NUEVA INTERACCIÓN
              </BatmanButton>
              <BatmanButton onClick={() => setIsMedalModalOpen(true)} className="ml-4">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5" />
                  AÑADIR MEDALLA
                </div>
              </BatmanButton>
            </div>
          </div>

          <div className="neu-card hover:scale-[1.02] transition-transform">
            <h3 className="text-xl font-bold mb-4 gradient-text flex items-center gap-2">
              <Award className="text-gold" />
              Tus Estadísticas
            </h3>
            <div className="space-y-4">
              <div className="neu-pressed p-4 rounded-xl">
                <p className="text-text-secondary">Puntos totales</p>
                <p className="text-2xl font-bold gradient-text">{points}</p>
              </div>
              <div className="neu-pressed p-4 rounded-xl">
                <p className="text-text-secondary">Interacciones</p>
                <p className="text-2xl font-bold gradient-text">{interactions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InteractionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingInteraction ? handleEditInteraction : handleNewInteraction}
        editingInteraction={editingInteraction}
      />
      <AddMedalModal
        isOpen={isMedalModalOpen}
        onClose={() => setIsMedalModalOpen(false)}
        onSubmit={handleAddMedal}
      />
    </div>
  );
}