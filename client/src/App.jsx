import { useEffect, useState } from 'react'
import { getTopTracks, getUserProfile } from './api/spotify'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getUserProfile()
      .then(data => {
        setUser(data);
        return getTopTracks();
      })
      .then(data => setTracks(data.items))
      .catch(console.error);
  }, []);

  function login() {
    window.location.href = "http://127.0.0.1:5000/login";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: userMsg }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "No response";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + err.message }]);
    }
  }

  return (
    <div>
      {user ? (
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
              <button className="logout-btn" onClick={() => {
                document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setUser(null);
                setTracks([]);
                setMessages([]);
              }}>Logout</button>
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
                <div key={i} className={`message ${msg.role}`}>
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
      ) : (
        <div className="landing">
          <div className="landing-header">
            <h1>Welcome to Zeltune</h1>
            <p>A Spotify playlist generator</p>
          </div>
          <div className="landing-body">
            <button className="login-btn" onClick={login}>Login with Spotify</button>
          </div>
        </div>
      )}
    </div>
  );
}