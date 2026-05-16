const sessions = new Map();

export function createSession(accessToken) {
    const sessionId = Math.random().toString(36).slice(2);
    sessions.set(sessionId, accessToken);
    return sessionId;
}

export function getToken(sessionId) {
    return sessions.get(sessionId);
}

export function removeSession(sessionId) {
    return sessions.delete(sessionId);
}