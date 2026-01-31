export const config = {
  // Backend URL from environment variable
  // Railway automatically provides this when you set REACT_APP_BACKEND_URL
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080',
  
  // WebSocket endpoint
  WS_ENDPOINT: '/ws',
  
  // Get WebSocket URL (converts http to ws, https to wss)
  getWebSocketUrl: function() {
    const url = this.BACKEND_URL.replace(/^http/, 'ws');
    return `${url}${this.WS_ENDPOINT}`;
  },
  
  // Debug mode
  isDevelopment: () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
};

// Log configuration on load (helpful for debugging)
if (config.isDevelopment()) {
  console.log('🔧 Config loaded:', {
    BACKEND_URL: config.BACKEND_URL,
    WS_URL: config.getWebSocketUrl(),
    ENV: process.env.NODE_ENV
  });
}