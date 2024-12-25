import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FancyInput } from '../FancyInput';
import { MedalSelection } from '../interactions/MedalSelection';
import type { Medal } from '../../types';

interface AddMedalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medalData: { medalId: string; date: string; description: string }) => Promise<void>;
}

export function AddMedalModal({ isOpen, onClose, onSubmit }: AddMedalModalProps) {
  const [selectedMedal, setSelectedMedal] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedMedal) {
      setError('Por favor, selecciona una medalla');
      return;
    }

    try {
      await onSubmit({
        medalId: selectedMedal,
        date,
        description
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la medalla');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-neu-base p-6 rounded-2xl w-full max-w-md mx-4 modal-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Añadir Medalla</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <MedalSelection
            selectedMedals={selectedMedal ? [selectedMedal] : []}
            onMedalToggle={(medalId) => setSelectedMedal(medalId)}
          />

          <div>
            <FancyInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              label="Fecha de obtención"
              required
            />
          </div>

          <div>
            <FancyInput
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              label="Descripción"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button type="submit" className="w-full animated-button">
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <strong>GUARDAR MEDALLA</strong>
          </button>
        </form>
      </div>
    </div>
  );
}