import React, { useState, useEffect, useRef } from 'react';
import { Send, Video, Users, Wifi, WifiOff } from 'lucide-react';
import { chatService } from './services/ChatService';
import { config } from './config';

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const commentsEndRef = useRef(null);

  // Auto-scroll to latest comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Setup WebSocket connection
  useEffect(() => {
    if (isUsernameSet) {
      // Register handlers
      chatService.onMessage(handleNewMessage);
      chatService.onConnectionChange(setIsConnected);
      
      // Connect
      chatService.connect(username)
        .then(() => {
          console.log('Connected successfully');
          setViewerCount(Math.floor(Math.random() * 50) + 10);
        })
        .catch(error => {
          console.error('Connection failed:', error);
          alert('Failed to connect to chat server. Please try again.');
        });

      // Cleanup on unmount
      return () => {
        chatService.disconnect();
        chatService.removeHandlers();
      };
    }
  }, [isUsernameSet, username]);

  // Handle new message from server
  const handleNewMessage = (message) => {
    const comment = {
      id: Date.now() + Math.random(),
      username: message.username,
      text: message.text,
      type: message.type,
      timestamp: new Date(message.timestamp).toLocaleTimeString(),
      isOwn: message.username === username
    };
    setComments(prev => [...prev, comment]);
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const handleSendComment = () => {
    if (newComment.trim() && isConnected) {
      const success = chatService.sendMessage(newComment);
      if (success) {
        setNewComment('');
      } else {
        alert('Failed to send message. Please check your connection.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isUsernameSet) {
        handleSendComment();
      } else {
        handleSetUsername();
      }
    }
  };

  // Rest of your UI code here...
  return (
    <div>
      <h1>Chat App</h1>
      <p>Backend: {config.BACKEND_URL}</p>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      // ... your chat UI
    </div>
  );
}

export default App;