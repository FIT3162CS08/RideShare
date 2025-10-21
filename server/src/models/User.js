const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 },
  reviewerId: { type: String, required: true },
  reviewerName: { type: String, required: true },
  tripId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "driver", "admin"], default: "user" },
    address: { type: String, required: true },
    birthday: { type: String, required: true },
    pushNotifs: { type: Boolean, required: true, default: true },
    saveReceipts: { type: Boolean, required: true, default: false },
    card: { type: Boolean, required: true, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    reviews: [ReviewSchema], // Array of reviews received as a driver
    currentTrip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", default: null },
    tripHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Past trips as rider
    driveHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Past trips as driver
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);