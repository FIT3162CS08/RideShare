"use client";

import React, { useEffect, useState } from "react";
import RatingStars from "./RatingStars";

interface Review {
  rating: number;
  comment: string;
  reviewerId: string;
  reviewerName: string;
  tripId: string;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface DriverReviewsDisplayProps {
  driverId: string;
  showStats?: boolean;
  limit?: number;
}

export default function DriverReviewsDisplay({ 
  driverId, 
  showStats = true, 
  limit = 10 
}: DriverReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [driverName, setDriverName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDriverReviews();
  }, [driverId]);

  async function fetchDriverReviews() {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${driverId}/driver-reviews?limit=${limit}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch driver reviews");
      }
      
      const data = await res.json();
      setReviews(data.reviews);
      setStats(data.stats);
      setDriverName(data.driverName);
    } catch (err) {
      console.error("Error fetching driver reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">Failed to load reviews</p>
        <button 
          onClick={fetchDriverReviews}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && stats && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{driverName}'s Rating</h3>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <RatingStars rating={stats.averageRating} size="lg" showNumber={false} />
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${stats.totalReviews > 0 
                        ? (stats.ratingDistribution[star as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {stats.ratingDistribution[star as keyof typeof stats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No reviews yet</p>
            <p className="text-sm">Be the first to review this driver!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={`${review.tripId}-${index}`} className="bg-white border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <RatingStars rating={review.rating} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {review.reviewerName}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
