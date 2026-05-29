import { useEffect, useState } from 'react'
import { getTopTracks, getUserProfile } from './api/spotify'

import Footer from "./components/Footer"
import './App.css'

import spotifyStock from "./assets/spotify_stock.jpg"
import keyboardStock from "./assets/keyboard_stock.png"
import playlistStock from "./assets/playlist_stock.png"
import logo from "./assets/zel-logo.png"

export default function App() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then(data => {
        setUser(data);
        return getTopTracks();
      })
      .then(data => setTracks(data.items))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function login() {
    window.location.href = "http://127.0.0.1:3001/login";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    try {
      const res = await fetch("http://127.0.0.1:3001/chat", {
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

  if (loading) return null;

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
              <button className="logout-btn" onClick={async () => {
                await fetch("http://127.0.0.1:3001/logout", { method: "POST", credentials: "include" });
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
      ) : (
        <div className="landing">
          <nav className="landing-nav">
            <div className="landing-logo">
              <img src={logo} width="28" height="28" />
              <span>Zeltune</span>
            </div>
            <button className="login-btn" onClick={login}>Login with Spotify</button>
          </nav>

          <section className="hero">
            <div className="hero-content">
              <h1>Your Playlist,<br/>Powered by <span className="highlight">AI</span></h1>
              <p>Connect Spotify, describe your mood, and let artificial intelligence craft the perfect playlist tailored to your taste.</p>
              <button className="hero-cta" onClick={login}>Get Started with Spotify</button>
            </div>
            <div className="hero-visual">
                <div className="hero-logo-wrapper">
                  <div className="hero-logo-glow"></div>
                  <img src={logo} className="hero-logo" width="200" />
                </div>
                <div className="hero-orb hero-orb-1"></div>
                <div className="hero-orb hero-orb-2"></div>
                <div className="hero-orb hero-orb-3"></div>
            </div>
          </section>

          <section className="feature-section">
            <div className="feature-inner">
              <div className="feature-image">
                <img src={spotifyStock} alt="Connect Spotify" />
              </div>
              <div className="feature-text">
                <h2>Connect Your Spotify</h2>
                <p>Sign in securely with your Spotify account. We sync your profile and listening history to personalize every playlist recommendation based on your unique taste.</p>
              </div>
            </div>
          </section>

          <section className="feature-section alt">
            <div className="feature-inner reversed">
              <div className="feature-image">
                <img src={keyboardStock} alt="Chat with AI" />
              </div>
              <div className="feature-text">
                <h2>Chat with AI</h2>
                <p>Describe your mood, favorite genres, or the vibe you're looking for. Our AI understands natural language and builds playlists that match exactly what you want.</p>
              </div>
            </div>
          </section>

          <section className="feature-section">
            <div className="feature-inner">
              <div className="feature-image">
                <img src={playlistStock} alt="Get Playlist" />
              </div>
              <div className="feature-text">
                <h2>Get Your Playlist</h2>
                <p>Receive a custom-curated playlist generated by AI, combining your unique taste with your current request. Save it directly to Spotify with one click.</p>
              </div>
            </div>
          </section>

          <section className="preview-section">
            <div className="preview-content">
              <div className="preview-chat">
                <div className="preview-msg user">
                  <div className="preview-bubble user-bubble">I want something upbeat for my morning run</div>
                </div>
                <div className="preview-msg assistant">
                  <div className="preview-bubble assistant-bubble">Here's a high-energy playlist with electronic, hip-hop, and rock tracks to power your run!</div>
                </div>
                <div className="preview-msg user">
                  <div className="preview-bubble user-bubble">Add some classic rock too</div>
                </div>
                <div className="preview-msg assistant">
                  <div className="preview-bubble assistant-bubble">Updated! Now featuring AC/DC, Queen, and Led Zeppelin alongside your modern tracks. Ready to save?</div>
                </div>
              </div>
              <div className="preview-text">
                <h2 className="section-title">Chat Like You're Talking to a Friend</h2>
                <p>Powered by Groq AI, Zeltune understands context, remembers your preferences, and creates playlists that match exactly what you're looking for.</p>
                <ul>
                  <li>Natural language understanding</li>
                  <li>Context-aware conversations</li>
                  <li>Personalized recommendations</li>
                  <li>One-click Spotify saving</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2>Ready to Discover Your Next Favorite Playlist?</h2>
            <p>Connect your Spotify account and start generating playlists with AI.</p>
            <button className="hero-cta" onClick={login}>Login with Spotify</button>
          </section>

          <Footer />
        </div>
      )}
    </div>
  );
}