import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

export function RankingCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-04-01T00:00:00');

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-neu-base/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="neu-card max-w-lg w-full mx-4 text-center space-y-6">
        <div className="flex justify-center">
          <Timer className="w-16 h-16 text-gold animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold gradient-text">
          El ranking comenzará el 1 de abril de 2025
        </h2>
        
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Horas', value: timeLeft.hours },
            { label: 'Minutos', value: timeLeft.minutes },
            { label: 'Segundos', value: timeLeft.seconds }
          ].map(({ label, value }) => (
            <div key={label} className="neu-pressed p-4 rounded-xl">
              <div className="text-2xl font-bold gradient-text">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-text-secondary">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-text-secondary">
          ¡Prepárate para comenzar la competición!
        </p>
      </div>
    </div>
  );
}