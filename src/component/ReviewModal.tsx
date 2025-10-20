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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-gradient rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-white/50 animate-scaleIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text-blue flex items-center gap-2">
            <svg className="w-8 h-8 text-yellow-400 animate-subtle-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Rate Your Driver
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all transform hover:scale-110"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Trip Details - Enhanced */}
        <div className="relative overflow-hidden rounded-2xl p-5 mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {driverName[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{driverName}</h3>
                <p className="text-sm text-gray-600">Your Driver</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">{tripDetails.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">{tripDetails.dropoff}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-blue-200">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">💰</span>
                </div>
                <span className="text-gray-700 font-bold">${tripDetails.fare.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating - Enhanced */}
          <div className="bg-white rounded-2xl p-5 shadow-sm relative z-10">
            <label className="block text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              How was your ride? *
            </label>
            <div className="flex justify-center py-2">
              <div className="relative z-20">
                <RatingStars
                  rating={rating}
                  onRatingChange={setRating}
                  interactive={true}
                  size="lg"
                />
              </div>
            </div>
            {errors.rating && (
              <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm text-red-700 font-medium">{errors.rating}</p>
              </div>
            )}
          </div>

          {/* Comment - Enhanced */}
          <div className="relative z-10">
            <label htmlFor="comment" className="block text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Tell us about your experience *
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the driver, vehicle, and overall experience..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none transition-all shadow-sm bg-white relative z-10"
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.comment && (
                <p className="text-sm text-red-600 font-medium">{errors.comment}</p>
              )}
              <p className={`text-xs ml-auto ${comment.length > 450 ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
                {comment.length}/500
              </p>
            </div>
          </div>

          {/* Rating Labels - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <p className="font-bold text-gray-800 mb-2 text-sm">⭐ Rating Guide:</p>
            <ul className="space-y-1.5 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-base">⭐</span>
                <span><strong>Poor</strong> - Significant issues</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">⭐⭐</span>
                <span><strong>Fair</strong> - Some problems</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">⭐⭐⭐</span>
                <span><strong>Good</strong> - Met expectations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">⭐⭐⭐⭐</span>
                <span><strong>Very Good</strong> - Exceeded expectations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-base">⭐⭐⭐⭐⭐</span>
                <span><strong>Excellent</strong> - Outstanding service</span>
              </li>
            </ul>
          </div>

          {/* Buttons - Enhanced */}
          <div className="flex gap-3 pt-4 relative z-10">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 relative z-10"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0 || !comment.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none shadow-lg relative z-10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Submit Review
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
