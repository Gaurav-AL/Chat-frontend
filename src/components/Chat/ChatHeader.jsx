export default function ChatHeader({ username }) {
  return (
    <div className="chat-header">
      <h2>Live Chat</h2>
      <p>Logged in as {username}</p>
    </div>
  );
}
