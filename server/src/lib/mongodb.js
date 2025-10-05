const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(
            "mongodb+srv://erictheov_db_user:5BGIbLGDDiGV8E6F@rideshare.delpkmg.mongodb.net/?retryWrites=true&w=majority&appName=RideShare",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        isConnected = true;
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
    }
}

module.exports = connectDB;
