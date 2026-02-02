export const config = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://chat-production-1260.up.railway.app',
  WS_ENDPOINT: '/ws',
  
  getWebSocketUrl: function() {
      return `${this.BACKEND_URL}${this.WS_ENDPOINT}`;
  },
  
  isDevelopment: () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
};