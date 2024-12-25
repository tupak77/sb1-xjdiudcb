import React from 'react';
import { Medal as MedalIcon, Trophy, Star } from 'lucide-react';
import { medals } from '../../data/medals';
import type { Medal } from '../../types';

interface UserMedalsProps {
  userMedals: Medal[];
  onUpdate?: () => void;
}

export function UserMedals({ userMedals, onUpdate }: UserMedalsProps) {
  const totalMedals = medals.length;
  const unlockedMedals = userMedals.length;
  const progress = (unlockedMedals / totalMedals) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Trophy className="text-gold" />
          Tus Medallas
        </h2>
        <div className="flex items-center gap-2">
          <MedalIcon className="text-gold" />
          <span className="font-bold">{unlockedMedals}/{totalMedals}</span>
        </div>
      </div>

      <div className="relative h-2 bg-neu-dark rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {medals.map((medal) => {
          const isUnlocked = userMedals.some(m => m.id === medal.id);
          
          return (
            <div
              key={medal.id}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105
                ${isUnlocked ? 'neu-element' : 'neu-pressed opacity-50'}`}
            >
              <div className="p-4 space-y-3">
                <div className={`
                  w-12 h-12 rounded-full mx-auto flex items-center justify-center
                  ${isUnlocked ? 'bg-gradient-to-r from-primary to-accent' : 'bg-neu-dark'}
                `}>
                  {medal.icon}
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold">{medal.name}</h3>
                  <p className="text-sm text-text-secondary">{medal.description}</p>
                </div>

                {isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-4 h-4 text-gold" fill="currentColor" />
                  </div>
                )}
              </div>

              <div className={`
                absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/80 to-accent/80
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${!isUnlocked ? 'hidden' : ''}
              `}>
                <p className="text-white font-bold">¡Desbloqueada!</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}