import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

const PaymentSchema = new Schema(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "aud" },
    stripePaymentIntentId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded", "cancelled"], 
      default: "pending" 
    },
    description: { type: String },
    failureReason: { type: String },
    completedAt: { type: Date },
    refundedAt: { type: Date },
    refundAmount: { type: Number },
  },
  { timestamps: true }
);

export type Payment = InferSchemaType<typeof PaymentSchema> & { _id: string };

export const PaymentModel: Model<Payment> = mongoose.models.Payment as Model<Payment> || mongoose.model<Payment>("Payment", PaymentSchema);