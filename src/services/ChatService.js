import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { config } from '../config';

class ChatService {
  constructor() {
    this.stompClient = null;
    this.isConnected = false;
    this.messageHandlers = [];
    this.connectionHandlers = [];
    this.username = null;
  }

  // Connect to backend WebSocket
  connect(username) {
    this.username = username;
    
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting to:', config.getWebSocketUrl());
        
        // Create SockJS socket
        const socket = new SockJS(config.getWebSocketUrl());
        
        // Create STOMP client
        this.stompClient = Stomp.over(socket);
        
        // Disable debug logging in production
        if (!config.isDevelopment()) {
          this.stompClient.debug = () => {};
        }
        
        // Connect
        this.stompClient.connect(
          {}, // headers
          (frame) => {
            console.log('✅ Connected to backend:', frame);
            this.isConnected = true;
            
            // Subscribe to messages
            this.stompClient.subscribe('/topic/messages', (message) => {
              const chatMessage = JSON.parse(message.body);
              console.log('📨 Received:', chatMessage);
              
              // Notify all message handlers
              this.messageHandlers.forEach(handler => handler(chatMessage));
            });
            
            // Send join message
            this.sendJoinMessage(username);
            
            // Notify connection handlers
            this.connectionHandlers.forEach(handler => handler(true));
            
            resolve();
          },
          (error) => {
            console.error('❌ Connection failed:', error);
            this.isConnected = false;
            this.connectionHandlers.forEach(handler => handler(false));
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ Connection error:', error);
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.disconnect(() => {
        console.log('👋 Disconnected from backend');
        this.isConnected = false;
      });
    }
  }

  // Send chat message
  sendMessage(text) {
    if (!this.stompClient || !this.isConnected) {
      console.error('❌ Not connected to backend');
      return false;
    }

    try {
      this.stompClient.send('/app/chat.send', {}, JSON.stringify({
        username: this.username,
        text: text,
        type: 'chat'
      }));
      console.log('📤 Sent:', text);
      return true;
    } catch (error) {
      console.error('❌ Send failed:', error);
      return false;
    }
  }

  // Send join message
  sendJoinMessage(username) {
    if (!this.stompClient || !this.isConnected) {
      return false;
    }

    try {
      this.stompClient.send('/app/chat.join', {}, JSON.stringify({
        username: username,
        type: 'join'
      }));
      return true;
    } catch (error) {
      console.error('❌ Join message failed:', error);
      return false;
    }
  }

  // Register message handler
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  // Register connection status handler
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler);
  }

  // Remove handlers
  removeHandlers() {
    this.messageHandlers = [];
    this.connectionHandlers = [];
  }
}

// Export singleton instance
export const chatService = new ChatService();