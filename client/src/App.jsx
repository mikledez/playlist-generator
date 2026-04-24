import { useEffect, useState } from 'react'
import './App.css'
import { getUserProfile } from './api/spotify';


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      getUserProfile(token).then(setUser).catch(console.error);
    }
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