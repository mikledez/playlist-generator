import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true
}));
app.use(cookieParser());

const PORT = 5000;
const tokens = new Map();

app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email user-top-read playlist-modify-public";
    const authUrl = "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: process.env.CLIENT_ID,
            scope,
            redirect_uri: process.env.REDIRECT_URI,
        });
    res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("No code provided");

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.REDIRECT_URI,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic " + Buffer.from(
                        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
                    ).toString("base64"),
                },
            }
        );

        const accessToken = response.data.access_token;
        const sessionId = Math.random().toString(36).slice(2);
        tokens.set(sessionId, accessToken);

        res.cookie("session_id", sessionId, { httpOnly: true, secure: true });
        res.redirect("http://127.0.0.1:5173/");
    } catch (err) {
        console.log(err.response?.data || err.message);
        res.send("Error logging in");
    }
});

app.get("/me", (req, res) => {
    const sessionId = req.cookies?.session_id;
    const token = tokens.get(sessionId);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + token }
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(401).json({ error: e.message }));
});

app.get("/top-tracks", (req, res) => {
    const sessionId = req.cookies?.session_id;
    const token = tokens.get(sessionId);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    axios.get("https://api.spotify.com/v1/me/top/tracks?limit=10", {
        headers: { Authorization: "Bearer " + token }
    })
    .then(r => res.json(r.data))
    .catch(e => res.status(401).json({ error: e.message }));
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));