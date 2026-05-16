import { useEffect, useState } from 'react'
import { getTopTracks, getUserProfile } from './api/spotify'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);

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
          <form id="chat-form">
            <input type="text" placeholder="Ask what you want..." />
            <button type="submit">Send</button>
          </form>
        </>
      ) : (
        <button onClick={login}>Login with Spotify</button>
      )}
    </div>
  );
}