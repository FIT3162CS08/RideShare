const express = require("express");

const auth_route = express.Router();

// Protected routes (require authentication)
auth_route.post("/register", () => {});
auth_route.post("/login", () => {});
auth_route.post("/logout", () => {});

module.exports = auth_route;
