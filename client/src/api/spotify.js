export async function getUserProfile() {
    const res = await fetch("http://127.0.0.1:5000/me", { credentials: "include" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
}

export async function getTopTracks() {
    const res = await fetch("http://127.0.0.1:5000/top-tracks", { credentials: "include" });
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
}