import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from './services/ChatService';
import { config } from './config';

import JoinScreen from './components/JoinScreen';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import ChatContainer from './components/Chat/ChatContainer';

import './App.css';

function App() {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleNewMessage = useCallback((message) => {
    setComments(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        username: message.username,
        text: message.text,
        type: message.type,
        timestamp: new Date(message.timestamp).toLocaleTimeString(),
        isOwn: message.username === username
      }
    ]);
  }, [username]);

  useEffect(() => {
    if (!isUsernameSet) return;

    chatService.onMessage(handleNewMessage);
    chatService.onConnectionChange(setIsConnected);

    chatService.connect(username)
      .then(() => setViewerCount(Math.floor(Math.random() * 50) + 10))
      .catch(() => alert('Failed to connect'));

    return () => {
      chatService.disconnect();
      chatService.removeHandlers();
    };
  }, [isUsernameSet, username, handleNewMessage]);

  if (!isUsernameSet) {
    return <JoinScreen username={username} setUsername={setUsername} onJoin={() => setIsUsernameSet(true)} />;
  }

  return (
    <div className="app">
      <Header isConnected={isConnected} viewerCount={viewerCount} backend={config.BACKEND_URL} />
      <div className="main">
        <VideoPlayer />
        <ChatContainer
          username={username}
          comments={comments}
          isConnected={isConnected}
          commentsEndRef={commentsEndRef}
        />
      </div>
    </div>
  );
}

export default App;
