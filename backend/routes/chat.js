import express from "express";
import * as spotifyApi from "../services/spotifyApi.js";
import { getGroqChatCompletion } from "../services/groq.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { userPrompt } = req.body;
        const chatCompletion = await getGroqChatCompletion(userPrompt);
        res.json(chatCompletion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;