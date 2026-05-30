import { useEffect, useState, useRef, useMemo } from 'react'
import { getTopTracks, getUserProfile } from './api/spotify'
import Landing from "./components/Landing"
import Dashboard from "./components/Dashboard"

let nextId = 1;

function createConversation() {
  return { id: nextId++, title: "New chat", messages: [] };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const messages = useMemo(() => {
    const activeConv = conversations.find(c => c.id === activeConvId);
    return activeConv ? activeConv.messages : [];
  }, [conversations, activeConvId]);

  useEffect(() => {
    getUserProfile()
      .then(data => {
        setUser(data);
        return getTopTracks();
      })
      .then(() => {
        const first = createConversation();
        setConversations([first]);
        setActiveConvId(first.id);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function login() {
    window.location.href = "http://127.0.0.1:3001/login";
  }

  function updateActiveConv(updater) {
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? updater(c) : c
    ));
  }

  function handleNewChat() {
    const conv = createConversation();
    setConversations(prev => [...prev, conv]);
    setActiveConvId(conv.id);
  }

  function handleSelectConv(id) {
    setActiveConvId(id);
  }

  function handleDeleteConv(id) {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 0) {
        const conv = createConversation();
        setActiveConvId(conv.id);
        return [conv];
      }
      if (id === activeConvId) {
        setActiveConvId(filtered[0].id);
      }
      return filtered;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    updateActiveConv(conv => {
      const updated = { ...conv, messages: [...conv.messages, { role: "user", content: userMsg }] };
      if (updated.messages.length === 1) {
        updated.title = userMsg.length > 40 ? userMsg.slice(0, 40) + "…" : userMsg;
      }
      return updated;
    });

    try {
      const res = await fetch("http://127.0.0.1:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: userMsg }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "No response";
      updateActiveConv(conv => ({
        ...conv,
        messages: [...conv.messages, { role: "assistant", content: reply }],
      }));
    } catch (err) {
      updateActiveConv(conv => ({
        ...conv,
        messages: [...conv.messages, { role: "assistant", content: "Error: " + err.message }],
      }));
    }
  }

  async function handleLogout() {
    await fetch("http://127.0.0.1:3001/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setConversations([]);
    setActiveConvId(null);
  }

  if (loading) return null;

  return (
    <div>
      {user ? (
        <Dashboard
          user={user}
          conversations={conversations}
          activeConvId={activeConvId}
          messages={messages}
          messagesEndRef={messagesEndRef}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          handleNewChat={handleNewChat}
          handleSelectConv={handleSelectConv}
          handleDeleteConv={handleDeleteConv}
          onLogout={handleLogout}
        />
      ) : (
        <Landing login={login} />
      )}
    </div>
  );
}
