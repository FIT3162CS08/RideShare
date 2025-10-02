const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/requireAuth");

const user_route = express.Router();

// Protected routes (require authentication)
user_route.get("/:id", auth, userController.getUserById); // get driver profile data
user_route.post("/:id", auth, userController.updateUser); // update driver profile data

module.exports = user_route;
