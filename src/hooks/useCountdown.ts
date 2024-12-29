import { useState, useEffect } from 'react';

interface CountdownTime {
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
}

export function useCountdown(targetDate: Date | null): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    hours: null,
    minutes: null,
    seconds: null
  });

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ hours: null, minutes: null, seconds: null });
      return;
    }

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ hours: null, minutes: null, seconds: null });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}