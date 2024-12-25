import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import type { User } from '../types';

export default function Leaderboard({ users }: { users: User[] }) {
  return (
    <div className="neu-card space-y-6">
      <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
        <Trophy className="text-gold" />
        Clasificación Global
      </h2>
      
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={user.id} className="neu-element p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold gradient-text">#{index + 1}</span>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <div className="flex gap-1 mt-1">
                  {user.medals.map((medal) => (
                    <Medal key={medal.id} size={16} className="text-gold" />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold gradient-text">{user.points}</span>
              <span className="text-sm ml-1">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}