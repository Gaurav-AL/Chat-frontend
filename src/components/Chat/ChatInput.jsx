import { Send } from 'lucide-react';
import { chatService } from '../../services/ChatService';
import React from 'react';

export default function ChatInput({ isConnected }) {
  const [text, setText] = React.useState('');

  const send = () => {
    if (text.trim()) {
      chatService.sendMessage(text);
      setText('');
    }
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
        disabled={!isConnected}
      />
      <button onClick={send} disabled={!isConnected}>
        <Send />
      </button>
    </div>
  );
}
