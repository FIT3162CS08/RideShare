import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const PaymentSchema = new Schema(
  {
    ride: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
    payer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    payee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "AUD" },
    method: { type: String, enum: ["card", "cash", "paypal", "stripe"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
    transactionId: { type: String },
  },
  { timestamps: true }
);

const Payment = models.Payment || model("Payment", PaymentSchema);

export default Payment;