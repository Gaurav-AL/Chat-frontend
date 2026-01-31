import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatContainer({
  username,
  comments,
  isConnected,
  commentsEndRef
}) {
  return (
    <div className="chat">
      <ChatHeader username={username} />
      <ChatMessages comments={comments} commentsEndRef={commentsEndRef} />
      <ChatInput isConnected={isConnected} />
    </div>
  );
}
