const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const driver_route = require("./routes/driver");
const user_route = require("./routes/user");
const auth_route = require("./routes/auth");
const rides_route = require("./routes/rides");
const reviews_route = require("./routes/reviews");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
app.listen(PORT, () => {
    console.log(`✅ Server running on port http://localhost:${PORT}`);
});
