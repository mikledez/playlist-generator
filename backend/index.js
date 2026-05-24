import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

import authRoutes from "./routes/auth.js";
import spotifyRoutes from "./routes/spotify.js";
import chatRoutes from "./routes/chat.js";


const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const PORT = 3001;

app.use("/", authRoutes);
app.use("/spotify", spotifyRoutes);
app.use("/", chatRoutes);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));