export default function ChatHeader({ username }) {
  return (
    <div className="chat-header">
      <p>Logged in as {username}</p>
    </div>
  );
}
