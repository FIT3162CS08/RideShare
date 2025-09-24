const express = require("express");

const reviews_route = express.Router();

// Protected routes (require authentication)
reviews_route.post("/:id", () => {}); // post a review
reviews_route.get("/:id", () => {}); // get a reviews

module.exports = reviews_route;
