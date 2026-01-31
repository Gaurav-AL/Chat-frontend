export const config = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://chat-production-1260.up.railway.app',
  WS_ENDPOINT: '/ws',
  
  getWebSocketUrl: function() {
    // const url = this.BACKEND_URL.replace(/^http/, 'ws');
    // return `${url}${this.WS_ENDPOINT}`;
    return this.BACKEND_URL;
  },
  
  isDevelopment: () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
};