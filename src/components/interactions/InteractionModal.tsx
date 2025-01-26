import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FancyInput } from '../FancyInput';
import { MedalSelection } from '../interactions/MedalSelection';
import type { Interaction } from '../../types';
import '../../styles/modal.css';
import '../../styles/confetti.css';

interface InteractionError {
  message: string;
}

interface InteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingInteraction?: any;
  onSubmit: (interaction: Omit<Interaction, 'id' | 'date'>) => void;
}

export function InteractionModal({ isOpen, onClose, onSubmit, editingInteraction }: InteractionModalProps) {
  const [targetUser, setTargetUser] = useState('');
  const [interactionType, setInteractionType] = useState<'lio' | 'chupachupa' | 'mandanga'>('lio');
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bonuses, setBonuses] = useState({
    raza: false,
    nationality: false,
    goldButton: false,
    shiny: false,
    milf: false,
    casada: false,
    dosPaDos: false,
    boostBarney: false
  });

  useEffect(() => {
    if (editingInteraction) {
      setTargetUser(editingInteraction.target_user);
      setInteractionType(editingInteraction.type);
      setBonuses({
        raza: editingInteraction.has_raza,
        nationality: editingInteraction.has_nationality,
        goldButton: editingInteraction.used_gold_button
      });
    }
  }, [editingInteraction]);

  if (!isOpen) return null;

  const calculatePoints = () => {
    let points = 0;
    switch (interactionType) {
      case 'lio': points = 5; break;
      case 'chupachupa': points = 10; break;
      case 'mandanga': points = 15; break;
    }
    if (bonuses.raza) points += 5;
    if (bonuses.nationality) points += 5;
    if (bonuses.casada) points += 10;
    if (bonuses.goldButton) points *= 2;
    if (bonuses.shiny) points *= 2;
    if (bonuses.milf) points *= 2;
    if (bonuses.dosPaDos) points *= 2;
    if (bonuses.boostBarney) points *= 2;
    return points;
  };

  const handleGoldButtonClick = () => {
    setBonuses(prev => ({ ...prev, goldButton: !prev.goldButton }));
    if (!bonuses.goldButton) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      onSubmit({
        type: interactionType,
        target_user: targetUser,
        points: calculatePoints(),
        bonuses
      });
      setTargetUser('');
      setBonuses({ raza: false, nationality: false, goldButton: false });
      setInteractionType('lio');
    } catch (err) {
      const error = err as InteractionError;
      setError(error.message || 'Error al guardar la interacción');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-overlay p-4">
      <div className="bg-neu-base p-4 sm:p-6 rounded-2xl w-full max-w-md modal-content max-h-[90vh] overflow-y-auto relative">
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti" style={{
                '--delay': `${Math.random() * 3}s`,
                '--rotation': `${Math.random() * 360}deg`,
                '--position': `${Math.random() * 100}%`,
              } as React.CSSProperties} />
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            {editingInteraction ? 'Editar Interacción' : 'Nueva Interacción'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-white/5 sticky"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 mt-2">
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Tipo de Interacción
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'lio', label: 'Lío', points: 5 },
                { value: 'chupachupa', label: 'Chupa Chupa', points: 10 },
                { value: 'mandanga', label: 'Mandanga', points: 15 }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setInteractionType(type.value as typeof interactionType)}
                  className={`p-3 rounded-xl text-center transition-all duration-300
                    ${interactionType === type.value 
                      ? 'neu-pressed gradient-text' 
                      : 'neu-element hover:scale-105'}`}
                >
                  <div className="text-sm font-semibold">{type.label}</div>
                  <div className="text-xs text-text-secondary">{type.points} pts</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <FancyInput
              type="text"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder="Nombre de la persona"
              required
              label="Persona"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-secondary">
              Bonificaciones
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'raza', label: 'Raza', points: '+5' },
                { key: 'nationality', label: 'Nacionalidad', points: '+5' },
                { key: 'casada', label: 'Casada', points: '+10' },
                { key: 'shiny', label: 'Shiny', points: 'x2' },
                { key: 'milf', label: 'Milf', points: 'x2' },
                { key: 'dosPaDos', label: '2 Pa 2', points: 'x2' },
                { key: 'boostBarney', label: 'Boost Barney', points: 'x2' }
              ].map((bonus) => (
                <button
                  key={bonus.key}
                  type="button"
                  onClick={() => setBonuses(prev => ({ 
                    ...prev, 
                    [bonus.key]: !prev[bonus.key as keyof typeof bonuses]
                  }))}
                  className={`p-3 rounded-xl text-center transition-all duration-300
                    ${bonuses[bonus.key as keyof typeof bonuses]
                      ? 'neu-pressed gradient-text'
                      : 'neu-element hover:scale-105'}`}
                >
                  <div className="text-sm font-semibold">{bonus.label}</div>
                  <div className="text-xs text-text-secondary">{bonus.points}</div>
                </button>
              ))}
              <button
                type="button"
                onClick={handleGoldButtonClick}
                className={`p-3 rounded-xl text-center transition-all duration-300 relative overflow-hidden
                  ${bonuses.goldButton
                    ? 'gold-button-active'
                    : 'gold-button'}`}
              >
                <div className="text-sm font-semibold">Botón de Oro</div>
                <div className="text-xs text-text-secondary">x2</div>
                <div className="gold-button-glow" />
              </button>
            </div>
          </div>

          <div className="neu-pressed p-4 rounded-xl text-center">
            <div className="text-sm text-text-secondary">Puntos totales</div>
            <div className="text-2xl font-bold gradient-text">{calculatePoints()}</div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full animated-button"
          >
            <div id="container-stars">
              <div id="stars"></div>
            </div>
            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <strong>{editingInteraction ? 'GUARDAR CAMBIOS' : 'AÑADIR PUNTOS'}</strong>
          </button>
        </form>
      </div>
    </div>
  );
}