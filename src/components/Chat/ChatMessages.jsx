export default function ChatMessages({ comments, commentsEndRef }) {
  return (
    <div className="chat-messages">
      {comments.map(c =>
        c.type === 'join' ? (
          <p key={c.id} className="join-msg">{c.text}</p>
        ) : (
          <div key={c.id} className={`message ${c.isOwn ? 'own' : ''}`}>
            <div className="meta">
              <span className="user">{c.username}</span>
              <span className="time">{c.timestamp}</span>
            </div>
            <p>{c.text}</p>
          </div>
        )
      )}
      <div ref={commentsEndRef} />
    </div>
  );
}
