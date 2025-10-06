"use client";

import React, { useEffect, useState } from "react";
import Chat from "@/component/Chat";
import ReviewModal from "@/component/ReviewModal";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/component/ProtectedRoute";
import { useUser } from "@/context/UserContext";

type Trip = {
  _id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status?: "waiting" | "picked_up" | "completed" | "cancelled";
};

export default function TripByIdPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripStatus, setTripStatus] = useState<"waiting" | "picked_up" | "completed">("waiting");
  const [showChat, setShowChat] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    setError(null);
    fetch(`/api/trips/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch trip: ${res.status}`);
        return res.json();
      })
      .then((data: Trip) => {
        if (!isMounted) return;
        setTrip(data);
        if (data.status === "picked_up") setTripStatus("picked_up");
        else if (data.status === "completed") setTripStatus("completed");
        else setTripStatus("waiting");
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function updateStatus(status: "picked_up" | "completed") {
    if (!trip) return;
    try {
      const res = await fetch(`/api/trips/${trip._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setTrip(updated);
      setTripStatus(updated.status ?? status);
    } catch (e) {
      console.error(e);
      alert("Could not update trip status");
    }
  }

  async function handleReviewSubmit(rating: number, comment: string) {
    if (!trip || !user) return;
    
    setReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          driverId: "driver123", // This should come from trip data
          userId: user._id,
          tripId: trip._id,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit review");
      }
      
      setHasReviewed(true);
      setShowReviewModal(false);
      alert("Thank you for your review!");
    } catch (error) {
      console.error("Review submission error:", error);
      alert(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading trip...</div>;
  }
  if (error || !trip) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center space-y-3">
          <div className="text-lg font-semibold">Unable to load trip</div>
          <div className="text-sm text-gray-500">{error ?? "Trip not found"}</div>
          <button onClick={() => router.push("/")} className="px-4 py-2 rounded-2xl border">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">RS</div>
              <span className="font-semibold tracking-tight">Your Trip</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat with Driver
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          <div className="bg-white rounded-3xl border p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {tripStatus === "waiting" && (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {tripStatus === "picked_up" && (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {tripStatus === "completed" && (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl font-semibold mb-2">
                {tripStatus === "waiting" && "Driver is on the way"}
                {tripStatus === "picked_up" && "Trip in progress"}
                {tripStatus === "completed" && "Trip completed"}
              </h1>
              <p className="text-gray-600">
                {tripStatus === "waiting" && `ETA available when driver assigned`}
                {tripStatus === "picked_up" && "Enjoy your ride!"}
                {tripStatus === "completed" && "Thank you for using RideShare!"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Pickup</div>
                  <div className="text-sm text-gray-500">{trip.pickup}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Dropoff</div>
                  <div className="text-sm text-gray-500">{trip.dropoff}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {tripStatus === "waiting" && (
                <button onClick={() => updateStatus("picked_up")} className="w-full px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">
                  Mark as Picked Up
                </button>
              )}
              {tripStatus === "picked_up" && (
                <button onClick={() => updateStatus("completed")} className="w-full px-4 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors">
                  Complete Trip
                </button>
              )}
              {tripStatus === "completed" && (
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold">Trip Summary</div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span>Fare</span>
                      <span className="text-xl font-bold">${trip.fare.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    disabled={hasReviewed}
                    className={`w-full px-4 py-3 rounded-2xl transition-colors ${
                      hasReviewed 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {hasReviewed ? "Review Submitted ✓" : "Rate & Review Driver"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <h3 className="text-lg font-semibold mb-4">Trip Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Trip ID</span>
                <span className="font-mono">{trip._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Fare</span>
                <span className="font-semibold">${trip.fare.toFixed(2)} AUD</span>
              </div>
            </div>
          </div>
        </main>

        <Chat isOpen={showChat} onClose={() => setShowChat(false)} riderName="You" driverName="Your Driver" role="rider" />

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          driverName="John D."
          tripDetails={{
            pickup: trip.pickup,
            dropoff: trip.dropoff,
            fare: trip.fare,
          }}
          loading={reviewLoading}
        />

        <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} RideShare. Mongo-backed demo.
        </footer>
      </div>
    </ProtectedRoute>  
  );
}


