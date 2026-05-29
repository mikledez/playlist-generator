import "./Dashboard.css"

export default function Dashboard({ user, tracks, messages, input, setInput, handleSubmit, onLogout }) {
  return (
    <>
      <div className="navBar">
        {user.images?.[0] && (
          <img
            src={user.images[0].url}
            alt={user.display_name}
            className="user-image"
          />
        )}
        <span>{user.display_name}</span>
        <div className="logout-container">
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <h2>Top Tracks</h2>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>{track.name} by {track.artists[0].name}</li>
        ))}
      </ul>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message-${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask what you want..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  )
}
