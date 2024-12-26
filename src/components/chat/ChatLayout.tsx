import React, { useEffect } from 'react';
import { ChatRoom } from './ChatRoom';
import { supabase } from '../../lib/supabase';

export function ChatLayout() {
  const [groupRoomId, setGroupRoomId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchGroupRoom = async () => {
      const { data } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('name', 'Formidable Chat')
        .eq('is_group', true)
        .single();

      if (data) {
        setGroupRoomId(data.id);
      }
    };

    fetchGroupRoom();
  }, []);

  if (!groupRoomId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="animate-pulse text-text-secondary">
          Cargando chat...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-neu-base">
      <ChatRoom roomId={groupRoomId} className="h-full" />
    </div>
  );
}