import axios from "axios";

const SPOTIFY_API = "https://api.spotify.com/v1";
const SPOTIFY_AUTH = "https://accounts.spotify.com/api/token";

function getAuthHeader(clientId, clientSecret) {
    return "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64");
}

export async function exchangeCodeForToken(code, clientId, clientSecret, redirectUri) {
    const response = await axios.post(
        SPOTIFY_AUTH,
        new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: getAuthHeader(clientId, clientSecret),
            },
        }
    );
    return response.data.access_token;
}

export async function getCurrentUser(token) {
    const response = await axios.get(SPOTIFY_API + "/me", {
        headers: { Authorization: "Bearer " + token },
    });
    return response.data;
}

export async function getTopTracks(token, limit = 10) {
    const response = await axios.get(SPOTIFY_API + `/me/top/tracks?limit=${limit}`, {
        headers: { Authorization: "Bearer " + token },
    });
    return response.data;
}

// export async function createPlaylist(token, userId, name, description = "") {
//     const response = await axios.post(
//         SPOTIFY_API + `/users/${userId}/playlists`,
//         { name, description },
//         {
//             headers: { Authorization: "Bearer " + token },
//         }
//     );
//     return response.data;
// }

// export async function addTracksToPlaylist(token, playlistId, trackUris) {
//     const response = await axios.post(
//         SPOTIFY_API + `/playlists/${playlistId}/tracks`,
//         { uris: trackUris },
//         {
//             headers: { Authorization: "Bearer " + token },
//         }
//     );
//     return response.data;
// }