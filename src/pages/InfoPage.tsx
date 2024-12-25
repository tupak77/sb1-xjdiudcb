import React from 'react';
import { Info, Star, Award, AlertCircle } from 'lucide-react';
import { InfoSection } from '../components/info/InfoSection';
import { PointItem } from '../components/info/PointItem';

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="neu-card space-y-8 bg-neu-base text-text-primary">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Info className="text-gold" />
            Cómo funciona Formidable
          </h1>
          
          <div className="space-y-8">
            <InfoSection title="Interacciones y Puntos Base" icon={<Star className="text-gold" />}>
              <ul className="space-y-4">
                <div className="neu-element p-4 flex justify-between items-center bg-neu-base">
                  <span>Lio</span>
                  <span className="font-bold text-gold">5 puntos</span>
                </div>
                <div className="neu-element p-4 flex justify-between items-center bg-neu-base">
                  <span>Chupa Chupa</span>
                  <span className="font-bold text-gold">10 puntos</span>
                </div>
                <div className="neu-element p-4 flex justify-between items-center bg-neu-base">
                  <span>Mandanga</span>
                  <span className="font-bold text-gold">15 puntos</span>
                </div>
              </ul>
            </InfoSection>

            <InfoSection title="Bonificaciones" icon={<Award className="text-gold" />}>
              <ul className="space-y-4">
                <div className="neu-element p-4 flex justify-between items-center bg-neu-base">
                  <span>Raza (atractivo físico excepcional)</span>
                  <span className="font-bold text-gold">+5 puntos</span>
                </div>
                <div className="neu-element p-4 flex justify-between items-center bg-neu-base">
                  <span>Otra nacionalidad</span>
                  <span className="font-bold text-gold">+5 puntos</span>
                </div>
                <div className="neu-element p-4 flex justify-between items-center bg-neu-base">
                  <span>Botón de Oro</span>
                  <span className="font-bold text-gold">x2 puntos</span>
                </div>
              </ul>
            </InfoSection>

            <InfoSection title="Reglas Importantes" icon={<AlertCircle className="text-gold" />}>
              <ul className="space-y-4">
                <div className="neu-pressed p-4 rounded-xl bg-neu-base">
                  <p className="text-text-secondary">Máximo 3 Mandangas con la misma persona</p>
                </div>
                <div className="neu-pressed p-4 rounded-xl bg-neu-base">
                  <p className="text-text-secondary">5 Botones de Oro disponibles por jugador al año</p>
                </div>
                <div className="neu-pressed p-4 rounded-xl bg-neu-base">
                  <p className="text-text-secondary">Las bonificaciones son acumulativas</p>
                </div>
                <div className="neu-pressed p-4 rounded-xl bg-neu-base">
                  <p className="text-text-secondary">Los puntos se actualizan en tiempo real</p>
                </div>
              </ul>
            </InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
}