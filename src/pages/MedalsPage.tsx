import React from 'react';
import { Medal } from 'lucide-react';
import { MedalCard } from '../components/medals/MedalCard';
import { medals } from '../data/medals';

export default function MedalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 gradient-text">
          <Medal className="text-gold" />
          Medallas y Logros
        </h1>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {medals.map((medal) => (
            <MedalCard key={medal.id} medal={medal} />
          ))}
        </div>
      </div>
    </div>
  );
}