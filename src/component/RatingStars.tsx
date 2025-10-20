"use client";

import React, { useState } from "react";

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export default function RatingStars({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = "md",
  showNumber = false 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };
  
  const handleClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };
  
  const handleMouseEnter = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  const displayRating = interactive ? (hoverRating || rating) : rating;
  
  return (
    <div className="flex items-center gap-1 relative z-20">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 transition-all duration-200 relative z-20 ${
              interactive ? "cursor-pointer hover:scale-125 active:scale-110" : "cursor-default pointer-events-none"
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= displayRating
                  ? "text-yellow-400 drop-shadow-[0_2px_4px_rgba(250,204,21,0.5)]"
                  : "text-gray-300"
              } transition-all duration-200 pointer-events-none`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

