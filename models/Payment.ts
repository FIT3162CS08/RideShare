import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  ride: mongoose.Types.ObjectId;          // reference to a Ride
  payer: mongoose.Types.ObjectId;         // usually the passenger
  payee: mongoose.Types.ObjectId;         // usually the driver
  amount: number;                         // fare in cents
  currency: string;                       // e.g. "AUD", "USD"
  method: string;                         // "card", "cash", "paypal", "stripe"
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;                 // external payment gateway ID
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
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

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;