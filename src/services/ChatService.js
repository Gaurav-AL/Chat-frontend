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

  connect(username) {
    this.username = username;
    
    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting to:', config.getWebSocketUrl());
        
        const socket = new SockJS(config.getWebSocketUrl());
        this.stompClient = Stomp.over(socket);
        
        if (!config.isDevelopment()) {
          this.stompClient.debug = () => {};
        }
        
        this.stompClient.connect(
          {},
          (frame) => {
            console.log('✅ Connected!', frame);
            this.isConnected = true;
            
            this.stompClient.subscribe('/topic/messages', (message) => {
              const chatMessage = JSON.parse(message.body);
              this.messageHandlers.forEach(handler => handler(chatMessage));
            });
            
            this.stompClient.send('/app/chat.join', {}, JSON.stringify({
              username: username,
              type: 'join'
            }));
            
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
        reject(error);
      }
    });
  }

  sendMessage(text) {
    if (!this.stompClient || !this.isConnected) {
      console.error('Not connected');
      return false;
    }

    this.stompClient.send('/app/chat.send', {}, JSON.stringify({
      username: this.username,
      text: text,
      type: 'chat'
    }));
    return true;
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  onConnectionChange(handler) {
    this.connectionHandlers.push(handler);
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.isConnected = false;
    }
  }

  removeHandlers() {
    this.messageHandlers = [];
    this.connectionHandlers = [];
  }
}

export const chatService = new ChatService();