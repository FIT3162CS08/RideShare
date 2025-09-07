const express = require("express");
const driverController = require("../controllers/driverController");
const auth = require("../middleware/auth");

const driver_route = express.Router();

// Protected routes (require authentication)
driver_route.get("/:id", auth, driverController.getUserById);
driver_route.post("/:id", auth, driverController.updateUser);

module.exports = driver_route;
