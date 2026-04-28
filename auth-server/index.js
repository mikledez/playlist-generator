import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import spotifyRoutes from "./routes/spotify.js";

dotenv.config();

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

app.listen(PORT, () => console.log(`Server running on ${PORT}`));