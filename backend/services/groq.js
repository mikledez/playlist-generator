import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
    You are Zeltune, a system that generates Spotify playlists if a user prompts for it.
    Return only a JSON array, each item looks like { "title": "Affection", "artist": "Jinsang" }, 
    containing a title and artist—no explanations or unrelated content.
`

export async function getGroqChatCompletion(userPrompt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userPrompt,
            }
        ],
        model: "openai/gpt-oss-20b",
    });
}