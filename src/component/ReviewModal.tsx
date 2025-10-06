"use client";

import React, { useState } from "react";
import RatingStars from "./RatingStars";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  driverName: string;
  tripDetails: {
    pickup: string;
    dropoff: string;
    fare: number;
  };
  loading?: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  driverName,
  tripDetails,
  loading = false,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!comment.trim()) {
      newErrors.comment = "Please write a comment";
    } else if (comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(rating, comment.trim());
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Rate Your Driver</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Trip Details */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div><span className="font-medium">Driver:</span> {driverName}</div>
            <div><span className="font-medium">From:</span> {tripDetails.pickup}</div>
            <div><span className="font-medium">To:</span> {tripDetails.dropoff}</div>
            <div><span className="font-medium">Fare:</span> ${tripDetails.fare.toFixed(2)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How was your ride? *
            </label>
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              interactive={true}
              size="lg"
            />
            {errors.rating && (
              <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your experience *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the driver, vehicle, and overall experience..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.comment && (
                <p className="text-sm text-red-600">{errors.comment}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {comment.length}/500 characters
              </p>
            </div>
          </div>

          {/* Rating Labels */}
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Rating Guide:</p>
            <ul className="space-y-1 text-xs">
              <li>⭐ Poor - Significant issues</li>
              <li>⭐⭐ Fair - Some problems</li>
              <li>⭐⭐⭐ Good - Met expectations</li>
              <li>⭐⭐⭐⭐ Very Good - Exceeded expectations</li>
              <li>⭐⭐⭐⭐⭐ Excellent - Outstanding service</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0 || !comment.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
