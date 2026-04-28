import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  function login() {
    window.location.href = "http://127.0.0.1:5000/login";
  }

  return (
    <div>
      {user ? (
        <h1>Welcome {user.display_name}</h1>
      ) : (
        <button onClick={login}>Login with Spotify</button>
      )}
    </div>
  );
}