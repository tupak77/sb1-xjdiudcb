import React from 'react';
import { medals } from '../../data/medals';
import type { MedalDisplay } from '../../types';

export interface MedalSelectionProps {
  selectedMedals: string[];
  onMedalToggle: (medalId: string) => void;
}

export const MedalSelection = ({ selectedMedals, onMedalToggle }: MedalSelectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-text-secondary">
        Medallas Disponibles
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
        {medals.map((medal: MedalDisplay) => (
          <button
            key={medal.id}
            onClick={() => onMedalToggle(medal.id)}
            className={`medal-option ${selectedMedals.includes(medal.id) ? 'selected' : ''}`}
          >
            <div className="medal-icon">
              {medal.icon}
            </div>
            <h3 className="medal-name">{medal.name}</h3>
            <p className="medal-description">{medal.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};