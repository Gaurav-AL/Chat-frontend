import { Video } from 'lucide-react';

export default function JoinScreen({ username, setUsername, onJoin }) {
  return (
    <div className="join-container">
      <div className="join-card">
        <Video className="icon" />
        <h1>Join Live Stream</h1>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={onJoin}>Join Chat</button>
      </div>
    </div>
  );
}
