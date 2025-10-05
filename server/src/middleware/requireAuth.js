const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
    const token = req.cookies?.access_token; // ← from cookie
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        req.user = jwt.verify(
            token,
            "3e91a83f98f2a0f0c7497f2efba05e0b6c34218f1ef6f2e67e33d7c6f47e71d3e6e9a2"
        );
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
