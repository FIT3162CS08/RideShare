const express = require("express");
const driverController = require("../controllers/driverController");
const auth = require("../middleware/requireAuth");

const driver_route = express.Router();

// Protected routes (require authentication)
driver_route.get("/:id", auth, driverController.getUserById); // get driver profile data
driver_route.post("/:id", auth, driverController.updateUser); // update driver profile data

// Import mongoose
//const mongoose = require("mongoose");
//const { default: Conversation } = require("../models/Conversation");
//
//(async () => {
//  try {
//    // Create a conversation
//    const conversation = await Conversation.create({
//      participants: [
//        new mongoose.Types.ObjectId("652a1f9c9c0a5f1e7c0e4a11"), // userId
//        new mongoose.Types.ObjectId("652a1f9c9c0a5f1e7c0e4a22")  // driverId
//      ],
//      lastMessage: "Hi, I’m waiting at the pickup spot."
//    });
//
//    // Insert messages into that conversation
//    await Message.insertMany([
//      {
//        conversationId: conversation._id,
//        senderId: new mongoose.Types.ObjectId("652a1f9c9c0a5f1e7c0e4a11"),
//        receiverId: new mongoose.Types.ObjectId("652a1f9c9c0a5f1e7c0e4a22"),
//        message: "Hi, I’m waiting near the entrance."
//      },
//      {
//        conversationId: conversation._id,
//        senderId: new mongoose.Types.ObjectId("652a1f9c9c0a5f1e7c0e4a22"),
//        receiverId: new mongoose.Types.ObjectId("652a1f9c9c0a5f1e7c0e4a11"),
//        message: "Okay, I’ll be there in 2 minutes."
//      }
//    ]);
//
//    console.log("✅ Inserted conversation + messages");
//    mongoose.connection.close();
//  } catch (err) {
//    console.error("❌ Error inserting:", err);
//  }
//})();
//

module.exports = driver_route;
