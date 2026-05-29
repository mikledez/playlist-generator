import { useEffect, useState } from 'react'
import { getTopTracks, getUserProfile } from './api/spotify'
import Landing from "./components/Landing"
import Dashboard from "./components/Dashboard"

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

  async function handleLogout() {
    await fetch("http://127.0.0.1:3001/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setTracks([]);
    setMessages([]);
  }

  if (loading) return null;

  return (
    <div>
      {user ? (
        <Dashboard
          user={user}
          tracks={tracks}
          messages={messages}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          onLogout={handleLogout}
        />
      ) : (
        <Landing login={login} />
      )}
    </div>
  );
}
