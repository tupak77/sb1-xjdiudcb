export interface ChatRoom {
  id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  is_group: boolean;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  last_read: string;
}

export interface UserStatus {
  user_id: string;
  status: 'online' | 'offline';
  last_seen: string;
}

export interface ChatState {
  activeRoom: string | null;
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  participants: Record<string, ChatParticipant[]>;
  userStatuses: Record<string, UserStatus>;
}