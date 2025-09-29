const express = require("express");
const { login, logout } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

const auth_route = express.Router();

// Public
// auth_route.post("/register", register);
auth_route.post("/login", login);

// Protected
auth_route.post("/logout", requireAuth, logout);

module.exports = auth_route;