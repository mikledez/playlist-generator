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
          <h1>Welcome {user.display_name}</h1>
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
        <button onClick={login}>Login with Spotify</button>
      )}
    </div>
  );
}