const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const user_route = express.Router();

// Protected routes (require authentication)
user_route.get("/:id", auth, userController.getUserById);
user_route.post("/:id", auth, userController.updateUser);

module.exports = user_route;
