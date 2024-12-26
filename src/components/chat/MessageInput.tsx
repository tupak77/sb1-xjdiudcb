import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) return;

    try {
      setSending(true);
      await onSend(trimmedMessage);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-4 border-t border-white/10"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-white/5 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className={`p-2 rounded-xl bg-primary text-white transition-all duration-200
            ${sending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
        >
          <Send className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </form>
  );
}