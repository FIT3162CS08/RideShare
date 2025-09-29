const express = require("express");

const rides_route = express.Router();

// Routes for the user
rides_route.post("/request", () => {}); // Post a ride request
rides_route.get("/requests", () => {}); // View all open ride requests
rides_route.get("/my-requests", () => {}); // View all ride requests created by logged-in user
rides_route.delete("/request/:id", () => {}); // Cancel ride request

// Routes for the driver
rides_route.post("/accept/:id", () => {}); // Accept a ride request
rides_route.get("/my-accepted", () => {}); // View rides accepted by the driver
rides_route.delete("/request/cancel/:id", () => {}); // Cancel ride request

module.exports = rides_route;
