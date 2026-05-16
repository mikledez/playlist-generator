import express from "express";
import * as spotifyApi from "../services/spotifyApi.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
    try {
        const user = await spotifyApi.getCurrentUser(req.token);
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

router.get("/top-tracks", requireAuth, async (req, res) => {
    try {
        const tracks = await spotifyApi.getTopTracks(req.token);
        res.json(tracks);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// router.post("/playlist", requireAuth, async (req, res) => {
//     try {
//         const { name, description } = req.body;
//         const user = await spotifyApi.getCurrentUser(req.token);
//         const playlist = await spotifyApi.createPlaylist(req.token, user.id, name, description);
//         res.json(playlist);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// router.post("/playlist/:id/tracks", requireAuth, async (req, res) => {
//     try {
//         const { tracks } = req.body;
//         const trackUris = tracks.map(t => t.uri);
//         await spotifyApi.addTracksToPlaylist(req.token, req.params.id, trackUris);
//         res.json({ success: true });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

export default router;