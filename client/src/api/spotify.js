const API_BASE = "http://127.0.0.1:3001/spotify";

export async function getUserProfile() {
    const res = await fetch(`${API_BASE}/me`, { credentials: "include" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
}

export async function getTopTracks() {
    const res = await fetch(`${API_BASE}/top-tracks`, { credentials: "include" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
}