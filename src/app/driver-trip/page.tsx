"use client";

import React, { useEffect, useRef, useState } from "react";
import Chat from "@/component/Chat";
import ProtectedRoute from "@/component/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { socket } from "@/socket/socket";


type Trip = {
  _id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: string;
  createdAt: string;
  driverId?: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
};

export default function DriverTripPage() {
  const { user } = useUser();
  const [tripStatus, setTripStatus] = useState<"waiting" | "picked_up" | "completed">("waiting");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const [conversation, setConversation] = useState({messages: [], convId: null});
  const [showChat, setShowChat] = useState(false);

  // Fetch the driver's current trip
  useEffect(() => {
    let mounted = true;
    const fetchTripData = async () => {
      try {
        if (!user?._id) {
          if (mounted) setLoading(false);
          return;
        }

        // Get driver's current trip (where they are the driver)
        const res = await fetch(`/api/driver/current-trip?userId=${user?._id}`);
        if (!res.ok) {
          if (mounted) setLoading(false);
          return;
        }
        const tripData = await res.json();
        
        if (mounted) {
          setTrip(tripData);
          if (tripData?.status) setTripStatus(tripData.status);
          else setTripStatus("waiting");

          const interval = setInterval(() => {
              console.log("LOGGING "+mapRef.current)

            if (mapRef.current && (window as any).google) {
              clearInterval(interval);

              const map = new google.maps.Map(mapRef.current, {
                zoom: 14,
              });

              console.log("LOGGING "+tripData)

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
  }, [user?._id]);

      // userId must be fetched from page
  useEffect(() => {
    const fetchMessages = async () => {
        if (!user && !trip) return;
        try {
          console.log("IDS: ", user._id, trip.riderId)
          const res = await fetch(`/api/message?userId=${trip.riderId}&driverId=${user._id}`);
          const conversations = await res.json();
          setConversation(conversations);
        } catch (err) {
            console.log("❌ Error fetching messages:", err);
        }
    };
    fetchMessages();

    // Listen for new messages        !!! Remove returning conversationId
    socket.on("newMessage", ({ msg, conversationId }) => {
      console.log("MSG: ", msg)
      setConversation((conv: any): any => ({messages: [...conv.messages, msg], conversationId}));
    });

    if (user) {
        socket.emit("join", user._id);
    }

    return () => {
        socket.off("newMessage");
    };
  }, [user, setConversation, trip])

  // Auto-refresh trip data every 5 seconds
  useEffect(() => {
    if (!user?._id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/driver/current-trip?userId=${user?._id}`);
        if (res.ok) {
          const tripData = await res.json();
          setTrip(tripData);
          if (tripData?.status) setTripStatus(tripData.status);
        }
      } catch (error) {
        console.error("Error refreshing trip data:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user?._id]);

  async function startConversation() {
    // Make a conversation
    await fetch(`/api/messages/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            passenger: '68e341296877a8123bb1f261',
            driver: '68e3422e6877a8123bb1f265',
            pickup: '35 plowman court, Epping',
            dropoff: 'Monash Clayton',
            date: '2004-03-10',
        }), // current driver
    });
    // ['68e3422e6877a8123bb1f265', '68e341296877a8123bb1f261']
  }


  async function markPickedUp() {
    if (!trip) return;
    
    try {
      const res = await fetch(`/api/trips/${trip._id}`, {
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
    if (!trip) return;
    
    try {
      const res = await fetch(`/api/trips/${trip._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      
      if (!res.ok) throw new Error("Failed to complete trip");
      
      setTripStatus("completed");
      
      // Show success message
      alert("Trip completed successfully! It has been added to your drive history.");
      
      // Redirect back to driver portal after a delay
      setTimeout(() => {
        window.location.href = "/driver_portal";
      }, 2000);
    } catch (error) {
      console.error("Error completing trip:", error);
      alert("Failed to complete trip. Please try again.");
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
            <p className="text-sm mt-2">You don't have any active trips as a driver.</p>
            <button 
              onClick={() => window.location.href = "/driver_portal"}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to Driver Portal
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white grid place-items-center font-bold shadow-lg animate-float">
                🚗
              </div>
              <div>
                <span className="font-bold text-lg gradient-text-blue">Driver Trip</span>
                <p className="text-xs text-gray-600">Track your drive in real-time</p>
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
                <span>Chat with Rider</span>
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
                {tripStatus === "waiting" && "Pick up the rider"}
                {tripStatus === "picked_up" && "Trip in progress"}
                {tripStatus === "completed" && "Trip completed"}
              </h1>

              <p className="text-lg text-gray-600 font-medium">
                {tripStatus === "waiting" && "🚗 Head to pickup location"}
                {tripStatus === "picked_up" && "🚗 Drive safely to destination"}
                {tripStatus === "completed" && "✨ Thank you for driving with RideShare!"}
              </p>
            </div>

            {/* Rider Info - Enhanced */}
            <div className="relative overflow-hidden rounded-2xl p-5 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-800">{trip.riderName || "Rider"}</div>
                  <div className="text-sm text-gray-600 font-medium">Passenger</div>
                  {trip.riderPhone && (
                    <div className="text-sm text-gray-500 mt-1">📞 {trip.riderPhone}</div>
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
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-xl"
                >
                  ✓ Mark as Picked Up
                </button>
              )}
              {tripStatus === "picked_up" && (
                <button
                  onClick={completeTrip}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold text-lg shadow-xl"
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
                        <div className="text-sm text-gray-600 font-medium">Your Earnings</div>
                        <div className="text-3xl font-bold text-green-700">${trip.fare.toFixed(2)}</div>
                      </div>
                      <div className="text-5xl">💰</div>
                    </div>
                  </div>
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
                <span className="font-mono font-bold text-gray-800">{trip._id.slice(-8)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-gray-600 font-medium">Your Earnings</span>
                <span className="font-bold text-lg gradient-text-blue">${trip.fare.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="font-semibold text-gray-800 capitalize">{tripStatus}</span>
              </div>
            </div>
          </div>
        </main>

        <Chat
          isOpen={showChat}
          conversation={conversation}
          onClose={() => setShowChat(false)}
          riderName={trip.riderName || "Rider"}
          driverName="You"
          role="driver"
          user={user}
        />

        <footer className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} RideShare. Safe travels! 🚗✨</p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}