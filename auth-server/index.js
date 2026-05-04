import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import spotifyRoutes from "./routes/spotify.js";

import Groq from "groq-sdk";

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const PORT = 5000;

app.use("/", authRoutes);
app.use("/spotify", spotifyRoutes);



const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "hello",
            },
        ],
        model: "openai/gpt-oss-20b",
    });
}

main();


app.listen(PORT, () => console.log(`Server running on ${PORT}`));