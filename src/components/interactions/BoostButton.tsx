import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useCountdown } from '../../hooks/useCountdown';
import '../../styles/boost-button.css';

interface BoostButtonProps {
  onBoostActivated?: () => void;
}

export function BoostButton({ onBoostActivated }: BoostButtonProps) {
  const [hasActiveBoost, setHasActiveBoost] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const { user } = useAuthStore();
  const { hours, minutes, seconds } = useCountdown(expiresAt);

  useEffect(() => {
    checkActiveBoost();
  }, [user]);

  const checkActiveBoost = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('boosts')
      .select('expires_at')
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!error && data) {
      setHasActiveBoost(true);
      setExpiresAt(new Date(data.expires_at));
    } else {
      setHasActiveBoost(false);
      setExpiresAt(null);
    }
  };

  const activateBoost = async () => {
    if (!user || hasActiveBoost || isActivating) return;

    try {
      setIsActivating(true);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase
        .from('boosts')
        .insert({
          user_id: user.id,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      setHasActiveBoost(true);
      setExpiresAt(expiresAt);
      onBoostActivated?.();
    } catch (error) {
      console.error('Error activating boost:', error);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <button
      onClick={activateBoost}
      disabled={hasActiveBoost || isActivating}
      className={`boost-button flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
        ${hasActiveBoost 
          ? 'neu-pressed bg-primary/20 cursor-not-allowed' 
          : 'neu-element hover:scale-105'}`}
    >
      <span className="boost-ripple"></span>
      <Zap className={`w-5 h-5 ${hasActiveBoost ? 'text-primary' : 'text-gold'}`} />
      <span>
        {hasActiveBoost && hours !== null
          ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : isActivating 
            ? 'Activando...' 
            : 'Boost (24h)'}
      </span>
    </button>
  );
}