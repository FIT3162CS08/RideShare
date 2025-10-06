import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  rating: number; // 1-5 stars
  comment: string;
  driverId: string;
  userId: string;
  tripId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  driverId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  tripId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure one review per user per trip
ReviewSchema.index({ userId: 1, tripId: 1 }, { unique: true });

// Add indexes for efficient queries
ReviewSchema.index({ driverId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });

export const ReviewModel = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
