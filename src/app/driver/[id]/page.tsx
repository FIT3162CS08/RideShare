"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/component/ProtectedRoute";
import DriverReviewsDisplay from "@/component/DriverReviewsDisplay";
import RatingStars from "@/component/RatingStars";
import { useParams } from "next/navigation";

// Driver Profile Page
export default function DriverProfilePage() {
  const { id } = useParams();
  const [driver, setDriver] = useState<{
    id: string;
    name: string;
    vehicle: string;
    rating: number;
    totalTrips: number;
    joinedDate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching driver data
    setLoading(true);
    setTimeout(() => {
      setDriver({
        id: id as string,
        name: "John D.",
        vehicle: "Blue Toyota Camry - ABC123",
        rating: 4.8,
        totalTrips: 1247,
        joinedDate: "2022-03-15",
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading driver profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !driver) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Driver Not Found</h1>
            <p className="text-gray-600 mb-4">The driver you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {driver.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
                <p className="text-gray-600">{driver.vehicle}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Driver Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Driver Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={driver.rating} size="sm" showNumber={true} />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Trips</span>
                    <span className="font-medium">{driver.totalTrips.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-medium">
                      {new Date(driver.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Vehicle Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">{driver.vehicle}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Verified Driver</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="lg:col-span-2">
              <DriverReviewsDisplay 
                driverId={driver.id} 
                showStats={true}
                limit={20}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RideShare. Driver Profile.
        </footer>
      </div>
    </ProtectedRoute>
  );
}