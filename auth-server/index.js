import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());

const PORT = 5000;

// Login route
app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email playlist-modify-public";

    const authUrl =
        "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: process.env.CLIENT_ID,
            scope,
            redirect_uri: process.env.REDIRECT_URI,
        });

    res.redirect(authUrl);
});

// Callback route
app.get("/callback", async (req, res) => {
    const code = req.query.code;

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
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
                        ).toString("base64"),
                },
            }
        );

        const access_token = response.data.access_token;

        return res.redirect(
            `http://127.0.0.1:5173/?token=${access_token}`
        );

    } catch (err) {
        console.log("FULL ERROR:");
        console.log(err.response?.data || err.message);
        return res.send("Error logging in");
    }
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));