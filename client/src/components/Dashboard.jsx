import "./Dashboard.css"

export default function Dashboard({
  user,
  conversations,
  activeConvId,
  messages,
  messagesEndRef,
  input,
  setInput,
  handleSubmit,
  handleNewChat,
  handleSelectConv,
  handleDeleteConv,
  onLogout,
}) {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>
          + New Chat
        </button>

        <div className="conv-list">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conv-item ${activeConvId === conv.id ? "active" : ""}`}
              onClick={() => handleSelectConv(conv.id)}
            >
              <span className="conv-title">{conv.title}</span>
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); handleDeleteConv(conv.id) }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          {user.images?.[0] && (
            <img src={user.images[0].url} alt="" className="sidebar-user-img" />
          )}
          <span className="sidebar-user-name">{user.display_name}</span>
          <button className="sidebar-logout" onClick={onLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-chat">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h1>Zeltune</h1>
              <p>Ask me to generate a Spotify playlist for any mood, genre, or occasion.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message Zeltune..."
          />
          <button type="submit" disabled={!input.trim()}>Send</button>
        </form>
      </main>
    </div>
  )
}
