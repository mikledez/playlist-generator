import express from "express";
import * as spotifyApi from "../services/spotifyApi.js";
import * as session from "../services/session.js";

const router = express.Router();

const SCOPES = "user-read-private user-read-email user-top-read playlist-modify-public";

router.get("/login", (req, res) => {
    const authUrl = "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: process.env.CLIENT_ID,
            scope: SCOPES,
            redirect_uri: process.env.REDIRECT_URI,
            show_dialog: true,
        });
    res.redirect(authUrl);
});

router.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("No code provided");

    try {
        const accessToken = await spotifyApi.exchangeCodeForToken(
            code,
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        const sessionId = session.createSession(accessToken);
        res.cookie("session_id", sessionId, { httpOnly: true });
        res.redirect("http://127.0.0.1:5173/");
    } catch (err) {
        console.log(err.response?.data || err.message);
        res.send("Error logging in");
    }
});

router.post("/logout", (req, res) => {
    const sessionId = req.cookies?.session_id;
    if (sessionId) session.removeSession(sessionId);
    res.clearCookie("session_id");
    res.json({ success: true });
});

export default router;