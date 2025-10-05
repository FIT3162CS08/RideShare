const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
    const token = req.cookies?.access_token; // ← from cookie
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        req.user = jwt.verify(token, "XXXXXX");
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
