import React, { useState, useEffect } from 'react';
import { Trophy, Search, Medal, Calendar, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { FancyInput } from '../components/FancyInput';
import type { Profile } from '../types';

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
    // Subscribe to realtime updates
    const channel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchProfiles()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, medals(id)')
        .order('points', { ascending: false });

      if (error) throw error;

      // Fetch last interaction dates in a separate query
      const { data: interactions } = await supabase
        .from('interactions')
        .select('user_id, created_at')
        .in('user_id', data.map(p => p.id));

      const lastGames = interactions?.reduce((acc, curr) => {
        if (!acc[curr.user_id] || new Date(curr.created_at) > new Date(acc[curr.user_id])) {
          acc[curr.user_id] = curr.created_at;
        }
        return acc;
      }, {} as Record<string, string>);

      const profilesWithLastGame = data.map((profile: any) => ({
        ...profile,
        medals: profile.medals?.length || 0,
        lastGame: lastGames?.[profile.id] ? new Date(lastGames[profile.id]) : null
      }));

      setProfiles(profilesWithLastGame);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    return (
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-xl transition-all duration-300 ${
              currentPage === i + 1
                ? 'neu-pressed gradient-text font-bold'
                : 'neu-element hover:scale-105'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="neu-card animate-pulse">
          <div className="h-8 bg-neu-dark rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neu-dark rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="neu-card space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Trophy className="text-gold" />
              Clasificación Global
            </h1>
            <div className="w-full md:w-64">
              <FancyInput
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="text-text-secondary" />}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-text-secondary">
                  <th className="py-4 px-2 text-left">#</th>
                  <th className="py-4 px-2 text-left">Usuario</th>
                  <th className="py-4 px-2 text-center">Puntos</th>
                  <th className="py-4 px-2 text-center">Medallas</th>
                  <th className="py-4 px-2 text-right hidden md:table-cell">Último juego</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {paginatedProfiles.map((profile, index) => {
                  const position = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  const isCurrentUser = profile.id === user?.id;
                  
                  return (
                    <tr
                      key={profile.id}
                      className={`transition-all duration-300 ${
                        isCurrentUser ? 'neu-pressed' : 'neu-element hover:scale-[1.02]'
                      }`}
                    >
                      <td className="py-4 px-2">
                        <span className={`
                          font-bold text-lg
                          ${position === 1 ? 'text-[#FFD700]' : ''}
                          ${position === 2 ? 'text-[#C0C0C0]' : ''}
                          ${position === 3 ? 'text-[#CD7F32]' : ''}
                          ${position > 3 ? 'gradient-text' : ''}
                        `}>
                          #{position}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent p-0.5">
                            <div className="w-full h-full rounded-full bg-neu-base flex items-center justify-center">
                              <User size={16} className="text-gold" />
                            </div>
                          </div>
                          <span className={isCurrentUser ? 'font-bold' : ''}>
                            {profile.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className="font-bold gradient-text">
                          {profile.points}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex justify-center gap-1">
                          <Medal size={16} className="text-gold" />
                          <span className="text-text-secondary">
                            {profile.medals || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-2 text-text-secondary">
                          <Calendar size={16} />
                          {profile.lastGame
                            ? new Date(profile.lastGame).toLocaleDateString()
                            : 'Sin actividad'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
}