const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect("XXXX", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
}

module.exports = connectDB;
