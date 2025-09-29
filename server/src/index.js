const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./lib/mongodb");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const driver_route = require("./routes/driver");
const user_route = require("./routes/user");
const auth_route = require("./routes/auth");
const rides_route = require("./routes/rides");
const reviews_route = require("./routes/reviews");

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);
const app = express();


app.use(cors({
  origin: "http://localhost:3000",  // frontend origin
  credentials: true,                // allow cookies
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(helmet());

// Example route
app.get("/", (req, res) => {
    res.json({ message: "Backend is running 🚀" });
});

app.use("/driver", driver_route); // user profile
app.use("/user", user_route); // user profile
app.use("/auth", auth_route); // login & signup
app.use("/rides", rides_route); // Handling rides
app.use("/reviews", reviews_route); // get/post reviews


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
