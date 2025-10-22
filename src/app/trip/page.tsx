"use client";

import React, { useEffect, useRef, useState } from "react";
import Chat from "@/component/Chat";
import ProtectedRoute from "@/component/ProtectedRoute";
import ReviewModal from "@/component/ReviewModal";
import { useUser } from "@/context/UserContext";
import { socket } from "@/socket/socket";

type Booking = {
  _id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  open: boolean;
  date?: string;
  time?: string;
  rideType?: string;
  phone?: string;
  payment?: string;
  notes?: string;
  status?: "waiting" | "picked_up" | "completed";
  driverId?: string;
};

export default function TripPage() {
  const { user } = useUser();
  const [tripStatus, setTripStatus] = useState<"waiting" | "picked_up" | "completed">("waiting");
  const [showChat, setShowChat] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [driver, setDriver] = useState<any | null>(null);
  const [conversation, setConversation] = useState({messages: [], convId: null});

  // Fetch the user's current trip
  useEffect(() => {
    let mounted = true;
    const fetchTripData = async () => {
      try {
        if (!user?._id || !user.currentTrip) {
          if (mounted) setLoading(false);
          return;
        }

        console.log('Fetching trip for currentTrip ID:', user.currentTrip);
        const res = await fetch(`/api/trips/${user.currentTrip}`);
        if (!res.ok) throw new Error("Failed to fetch trip");
        const tripData = await res.json();
        
        console.log("CURRENT TRIP" + tripData)

        if (mounted) {
          setBooking(tripData);
          if (tripData?.status) setTripStatus(tripData.status);
          else setTripStatus("waiting");

          const interval = setInterval(() => {
            if (mapRef.current && (window as any).google) {
              clearInterval(interval);
              console.log("HERE", tripData)

              const map = new google.maps.Map(mapRef.current, {
                zoom: 14,
              });

              const directionsService = new google.maps.DirectionsService();
              directionsRendererRef.current = new google.maps.DirectionsRenderer();
              directionsRendererRef.current.setMap(map);

              directionsService.route(
                {
                  origin: tripData.pickup,
                  destination: tripData.dropoff,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === "OK" && result) {
                    directionsRendererRef.current?.setDirections(result);
                  } else {
                    console.error("Directions request failed:", status);
                  }
                }
              );
            }
          }, 100);

          return () => clearInterval(interval);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTripData();
    return () => {
      mounted = false;
    };
  }, [user?._id, user?.currentTrip]);

  // Auto-refresh trip data every 5 seconds to check for driver assignment
  useEffect(() => {
    if (!user?.currentTrip) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/trips/${user.currentTrip}`);
        if (res.ok) {
          const tripData = await res.json();
          setBooking(tripData);
          if (tripData?.status) setTripStatus(tripData.status);
        }
      } catch (error) {
        console.error("Error refreshing trip data:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.currentTrip]);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      if (!booking?.driverId || booking.driverId === "unassigned") return;

      try {
        const res = await fetch(`/api/users/${booking.driverId}`);
        if (!res.ok) throw new Error("Failed to fetch driver info");
        const driverData = await res.json();
        setDriver(driverData);
      } catch (err) {
        console.error("Error fetching driver info:", err);
      }
    };

    fetchDriverInfo();
  }, [booking?.driverId]);

    // Fetch messages and setup Socket
  // DRIVER ID: 68df43eeb62c6d544a5dcac7. USER ID: 68f79222ae086705ddfd1477. 
  // driverId must be fetched from page
  useEffect(() => {
    const fetchMessages = async () => {
        if (!user) return;
        try {
            console.log("IDS: ", user._id, '68f79222ae086705ddfd1477')
            const res = await fetch(`/api/message?userId=${user._id}&driverId=${'68f79222ae086705ddfd1477'}`);
            const conversations = await res.json();
            setConversation(conversations);
        } catch (err) {
            console.log("❌ Error fetching messages:", err);
        }
    };
    fetchMessages();

    // Listen for new messages        !!! Remove returning conversationId
    socket.on("newMessage", ({ msg, conversationId }) => {
        setConversation((conv: any): any => ({messages: [...conv.messages, msg], conversationId}));
    });

    if (user) {
        socket.emit("join", user._id);
    }

    return () => {
        socket.off("newMessage");
    };
  }, [user, setConversation])

  // Derived trip object (keeps existing fields/UI intact)
  const trip = booking
  ? {
      id: booking._id || "N/A",
      driver: driver
        ? driver.name
        : booking.driverId && booking.driverId !== "unassigned"
          ? "Driver Assigned"
          : "Waiting for Driver",
      driverPhone: driver?.phone || null,
      driverRating: driver?.rating || 4.8,
      vehicle:
        driver?.vehicle ||
        (booking.rideType === "premium"
          ? "Premium Vehicle"
          : booking.rideType === "xl"
          ? "XL Vehicle"
          : "Standard Vehicle"),
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      fare: booking.fare ?? 0,
      eta: 3,
    } : null;

  async function markPickedUp() {
    if (!booking) return;
    
    try {
      const res = await fetch(`/api/trips/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "picked_up" }),
      });
      
      if (!res.ok) throw new Error("Failed to update trip status");
      
      setTripStatus("picked_up");
    } catch (error) {
      console.error("Error updating trip status:", error);
      alert("Failed to update trip status. Please try again.");
    }
  }

  async function completeTrip() {
    if (!booking) return;
    
    try {
      const res = await fetch(`/api/trips/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      
      if (!res.ok) throw new Error("Failed to complete trip");
      
      setTripStatus("completed");
      
      // Show success message
      alert("Trip completed successfully! It has been added to your trip history.");
    } catch (error) {
      console.error("Error completing trip:", error);
      alert("Failed to complete trip. Please try again.");
    }
  }

  async function handleReviewSubmit(rating: number, comment: string) {
    if (!trip) return;
    
    setSubmittingReview(true);
    try {
      // For demo purposes, use a placeholder driver ID
      // In production, this would come from the booking/trip data
      const driverId = booking?.driverId || "demo-driver-123";
      
      const res = await fetch(`/api/users/${driverId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          tripId: trip.id,
          userId: user?._id || "anonymous",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await res.json();
      console.log("Review submitted successfully:", data);
      
      // Success!
      setShowReviewModal(false);
      
      // Show beautiful success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-fadeIn z-50 font-bold';
      successDiv.innerHTML = '🌟 Thank you for your review!';
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
      
    } catch (error) {
      console.error("Review error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit review. Please try again.";
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-fadeIn z-50 font-bold';
      errorDiv.innerHTML = `❌ ${errorMessage}`;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 4000);
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading your trip...
        </div>
      </ProtectedRoute>
    );
  }

  if (!trip) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p>No active trip found.</p>
            <p className="text-sm mt-2">User currentTrip: {user?.currentTrip ? String(user.currentTrip) : 'null'}</p>
            <p className="text-xs mt-1 text-gray-400">
              {!user?.currentTrip ? 'No currentTrip set for this user' : 'Failed to load trip data'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-10 glass-strong border-b border-white/30 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white grid place-items-center font-bold shadow-lg animate-float">
                🚗
              </div>
              <div>
                <span className="font-bold text-lg gradient-text-blue">Your Trip</span>
                <p className="text-xs text-gray-600">Track your ride in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Chat with Driver</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main with animations */}
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Trip Status - Enhanced */}
          <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/30 animate-scaleIn">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl ${
                tripStatus === "waiting" ? "bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse" :
                tripStatus === "picked_up" ? "bg-gradient-to-br from-green-400 to-green-600" :
                "bg-gradient-to-br from-purple-400 to-purple-600"
              }`}>
                {tripStatus === "waiting" && (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {tripStatus === "picked_up" && (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {tripStatus === "completed" && (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-3 gradient-text-blue">
                {tripStatus === "waiting" && "Finding a driver"}
                {tripStatus === "picked_up" && "Trip in progress"}
                {tripStatus === "completed" && "Trip completed"}
              </h1>

              <p className="text-lg text-gray-600 font-medium">
                {tripStatus === "waiting" && `⏱️ Hold on tight`}
                {tripStatus === "picked_up" && "🚗 Enjoy your ride!"}
                {tripStatus === "completed" && "✨ Thank you for using RideShare!"}
              </p>
            </div>

            {/* Driver Info - Enhanced */}
            <div className="relative overflow-hidden rounded-2xl p-5 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {trip.driver !== "Waiting for Driver" && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">{trip.driver}</div>
                  <div className="text-sm text-gray-600 font-medium">{trip.vehicle}</div>
                  {trip.driver !== "Waiting for Driver" ? (
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-5 h-5 text-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-gray-800">{trip.driverRating}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mt-1">
                      We're looking for a driver for your ride...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Details - Enhanced */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">Pickup Location</div>
                  <div className="text-sm text-gray-600">{trip.pickup}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">Dropoff Location</div>
                  <div className="text-sm text-gray-600">{trip.dropoff}</div>
                </div>
              </div>
            </div>

            {/* Map - Enhanced */}
            <div className="w-full h-80 rounded-3xl overflow-hidden mb-6 shadow-2xl border-4 border-white">
              <div ref={mapRef} className="w-full h-full" />
            </div>

            {/* Trip Actions - Enhanced */}
            <div className="mt-6 space-y-3">
              {tripStatus === "waiting" && (
                <button
                  onClick={markPickedUp}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-xl"
                >
                  ✓ Mark as Picked Up
                </button>
              )}
              {tripStatus === "picked_up" && (
                <button
                  onClick={completeTrip}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-xl"
                >
                  ✓ Complete Trip
                </button>
              )}
              {tripStatus === "completed" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold gradient-text-blue mb-4">Trip Summary</h3>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-6 border-2 border-green-200 shadow-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Total Fare</div>
                        <div className="text-3xl font-bold text-green-700">${trip.fare.toFixed(2)}</div>
                      </div>
                      <div className="text-5xl">💰</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-xl animate-shimmer relative overflow-hidden"
                  >
                    ⭐ Rate & Review Driver
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trip Info - Enhanced */}
          <div className="glass-strong rounded-3xl p-6 shadow-xl border border-white/30 animate-slideInRight">
            <h3 className="text-xl font-bold gradient-text-blue mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Trip Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-gray-600 font-medium">Trip ID</span>
                <span className="font-mono font-bold text-gray-800">{trip.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-gray-600 font-medium">Estimated Fare</span>
                <span className="font-bold text-lg gradient-text-blue">${trip.fare.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-gray-600 font-medium">Payment Method</span>
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Card •••• 1234
                </span>
              </div>
            </div>
          </div>
        </main>

        <Chat
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          riderName="You"
          driverName={trip.driver}
          role="rider"
        />

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          driverName={trip.driver}
          tripDetails={{
            pickup: trip.pickup,
            dropoff: trip.dropoff,
            fare: trip.fare,
          }}
        />

        <Chat
          isOpen={showChat}
          conversation={conversation}
          onClose={() => setShowChat(false)}
          riderName="You"
          driverName="XXXXXXX"
          role="rider"
          user={user}
        />

        <footer className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} RideShare. Safe travels! 🚗✨</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}