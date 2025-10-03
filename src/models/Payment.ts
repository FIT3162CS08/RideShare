import mongoose, { Schema, Model, InferSchemaType } from "mongoose";


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

export type Payment = InferSchemaType<typeof PaymentSchema> & { _id: string };

export const PaymentModel: Model<Payment> = mongoose.models.Payment as Model<Payment> || mongoose.model<Payment>("Payment", PaymentSchema);