import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Video, Users, Wifi, WifiOff } from 'lucide-react';
import { chatService } from './services/ChatService';
import { config } from './config';
import './App.css';

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

  // Handle new message from server - useCallback to prevent re-creating
  const handleNewMessage = useCallback((message) => {
    const comment = {
      id: Date.now() + Math.random(),
      username: message.username,
      text: message.text,
      type: message.type,
      timestamp: new Date(message.timestamp).toLocaleTimeString(),
      isOwn: message.username === username
    };
    setComments(prev => [...prev, comment]);
  }, [username]);

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
  }, [isUsernameSet, username, handleNewMessage]);

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

  if (!isUsernameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
          <div className="text-center mb-6">
            <Video className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Join Live Stream</h1>
            <p className="text-gray-400">Enter your username to start chatting</p>
            <div className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300">
              <p className="font-semibold mb-1">Backend: Java Spring Boot</p>
              <p className="text-xs text-gray-500">WebSocket + Redis Pub/Sub</p>
            </div>
          </div>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              maxLength={20}
              autoFocus
            />
            <button
              onClick={handleSetUsername}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-t-lg p-4 border-b border-gray-700">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold text-white">Live Stream</h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{viewerCount}</span>
              <span className="text-sm">watching</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Backend: {config.BACKEND_URL}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Video Player */}
          <div className="lg:col-span-2 bg-black aspect-video flex items-center justify-center">
            <div className="text-center p-8">
              <Video className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Video Stream Placeholder</p>
              <p className="text-gray-600 text-sm">Embed your video player here</p>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-gray-900 flex flex-col h-[600px] lg:h-auto">
            {/* Chat Header */}
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
              <h2 className="font-semibold text-white">Live Chat</h2>
              <p className="text-xs text-gray-400">Logged in as {username}</p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className={`${comment.type === 'join' ? 'text-center' : ''}`}>
                  {comment.type === 'join' ? (
                    <p className="text-xs text-gray-500 italic">{comment.text}</p>
                  ) : (
                    <div className={`${comment.isOwn ? 'ml-auto bg-blue-900' : 'bg-gray-800'} rounded-lg p-3 max-w-[85%] ${comment.isOwn ? 'ml-auto' : ''}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-semibold text-sm ${comment.isOwn ? 'text-blue-300' : 'text-purple-400'}`}>
                          {comment.username}
                        </span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-white text-sm break-words">{comment.text}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected ? "Type a message..." : "Connecting..."}
                  disabled={!isConnected}
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
                  maxLength={200}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!newComment.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send • {isConnected ? 'Connected to Spring Boot' : 'Reconnecting...'}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-b-lg p-4 border-t border-gray-700">
          <details className="text-sm text-gray-400">
            <summary className="cursor-pointer font-semibold text-white hover:text-blue-400">
              🔧 Connection Info
            </summary>
            <div className="mt-3 space-y-2 pl-4">
              <p><span className="text-blue-400">Backend:</span> {config.BACKEND_URL}</p>
              <p><span className="text-blue-400">WebSocket:</span> {config.getWebSocketUrl()}</p>
              <p><span className="text-blue-400">Status:</span> {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default App;