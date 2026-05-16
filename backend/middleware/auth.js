import * as session from "../services/session.js";

export function requireAuth(req, res, next) {
    const sessionId = req.cookies?.session_id;
    const token = session.getToken(sessionId);
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    req.token = token;
    next();
}