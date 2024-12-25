import React from 'react';
import type { MedalDisplay } from '../../types';
import '../../styles/card.css';

interface MedalCardProps {
  medal: MedalDisplay;
}

export function MedalCard({ medal }: MedalCardProps) {
  return (
    <div className="medal-card">
      <div className="medal-card-inner">
        <div className="medal-card-front">
          <div className="text-gold animate-bounce-slow">
            {medal.icon}
          </div>
          <h3 className="text-xl font-bold text-center gradient-text">
            {medal.name}
          </h3>
        </div>
        <div className="medal-card-back">
          <div className="medal-card-back-content">
            <p className="text-text-secondary">
              {medal.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}