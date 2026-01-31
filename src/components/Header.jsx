import { Wifi, WifiOff, Users } from 'lucide-react';

export default function Header({ isConnected, viewerCount, backend }) {
  return (
    <header className="header">
      <div className="left">
        <span className="live-dot" />
        <h1>Live Stream</h1>
        <span className={isConnected ? 'connected' : 'disconnected'}>
          {isConnected ? <Wifi /> : <WifiOff />}
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="right">
        <Users />
        {viewerCount} watching
      </div>

      <div className="backend-info">Backend: {backend}</div>
    </header>
  );
}
