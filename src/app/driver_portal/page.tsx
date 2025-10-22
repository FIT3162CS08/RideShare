"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/component/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { socket } from "@/socket/socket";
import Chat from "@/component/Chat";


type Booking = {
  _id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  rideType: string;
  passengers: number;
  luggage: number;
  phone: string;
  notes?: string;
  createdAt: string;
  userId: string;
};

type DriveHistory = {
  _id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: string;
  createdAt: string;
  riderId?: string;
};

export default function DriverPortal() {
  const { user } = useUser();
  console.log("user: ", user)
  const [openBookings, setOpenBookings] = useState<Booking[]>([]);
  const [driveHistory, setDriveHistory] = useState<DriveHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [online, setOnline] = useState(false);
  const [conversation, setConversation] = useState({messages: [], convId: null});
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchDriveHistory();
  }, [user]);

    // userId must be fetched from page
  useEffect(() => {
    const fetchMessages = async () => {
        if (!user) return;
        try {
          console.log("IDS: ", user._id, '68df43eeb62c6d544a5dcac7')
            const res = await fetch(`/api/message?userId=${'68df43eeb62c6d544a5dcac7'}&driverId=${user._id}`);
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
  }, [user, setConversation])

  const fetchDriveHistory = async () => {
    if (!user?._id) return;
    setHistoryLoading(true)
    try {
      const res = await fetch(`/api/driver/drive-history?userId=${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        setDriveHistory(data.driveHistory || []);
      }
    } catch (error) {
      console.error("Error fetching drive history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchOpenBookings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/driver/open-bookings");
      if (!res.ok) throw new Error("Failed to fetch open bookings");
      const data = await res.json();
      setOpenBookings(data);
    } catch (error) {
      console.error("Error fetching open bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const goOnline = () => {
    setOnline(true);
    fetchOpenBookings();
  };

  const goOffline = () => {
    setOnline(false);
    setOpenBookings([]);
  };

  const acceptBooking = async (bookingId: string) => {
    if (!user?._id) return;
    
    setAccepting(bookingId);
    try {
      const res = await fetch("/api/driver/accept-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          driverId: user._id,
        }),
      });

      await startConversation()

      if (!res.ok) throw new Error("Failed to accept booking");
      
      // Remove the accepted booking from the list
      setOpenBookings(prev => prev.filter(booking => booking._id !== bookingId));
      
      // Show success message and redirect to driver trip page
      alert("Booking accepted successfully! Redirecting to your trip...");
      window.location.href = "/driver-trip";
    } catch (error) {
      console.error("Error accepting booking:", error);
      alert("Failed to accept booking. Please try again.");
    } finally {
      setAccepting(null);
    }
  };

  async function startConversation() {
      // Make a conversation
      await fetch(`/api/messages/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              passenger: '68e341296877a8123bb1f261',
              driver: user._id,
              pickup: '35 plowman court, Epping',
              dropoff: 'Monash Clayton',
              date: '2004-03-10',
          }), // current driver
      });
    // ['68e3422e6877a8123bb1f265', '68e341296877a8123bb1f261']
  }


  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading open bookings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Driver Portal</h1>
                <p className="text-gray-600 mt-1">Available rides waiting for drivers</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchOpenBookings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <div className="text-sm text-gray-600">
                  {openBookings.length} open booking{openBookings.length !== 1 ? 's' : ''}
                </div>
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

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Overview Section */}
          {!online && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">You're Offline</h2>
              <p className="text-gray-600 mb-6">
                Go online to start receiving ride requests from students and staff.
              </p>
              <button 
                onClick={goOnline}
                className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors font-bold text-lg"
              >
                Go Online
              </button>
            </div>
          )}

          {/* Online Section */}
          {online && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Available Rides</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Online</span>
                    </div>
                    <button
                      onClick={goOffline}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Go Offline
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading available rides...</p>
                  </div>
                ) : openBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No Available Rides</h4>
                    <p className="text-gray-600">There are currently no rides waiting for drivers.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openBookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="text-lg font-semibold text-gray-800">
                                {booking.rideType === "premium" ? "Premium" : 
                                 booking.rideType === "xl" ? "XL" : "Standard"} Ride
                              </div>
                              <div className="text-2xl font-bold text-green-600">${booking.fare.toFixed(2)}</div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <div className="font-medium text-gray-800">Pickup</div>
                                <div>{booking.pickup}</div>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">Dropoff</div>
                                <div>{booking.dropoff}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{booking.passengers} passenger{booking.passengers !== 1 ? 's' : ''}</span>
                              <span>•</span>
                              <span>{booking.luggage} bag{booking.luggage !== 1 ? 's' : ''}</span>
                              <span>•</span>
                              <span>Posted {new Date(booking.createdAt).toLocaleString()}</span>
                            </div>
                            
                            {booking.notes && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                                <span className="font-medium">Note:</span> {booking.notes}
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <button
                              onClick={() => acceptBooking(booking._id)}
                              disabled={accepting === booking._id}
                              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                              {accepting === booking._id ? "Accepting..." : "Accept Ride"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drive History Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Drive History</h3>
            
            {historyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading drive history...</p>
              </div>
            ) : driveHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500">No drives yet</p>
                <p className="text-sm text-gray-400 mt-1">Your drive history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {driveHistory.slice(0, 5).map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        trip.status === "completed" ? "bg-green-500" :
                        trip.status === "picked_up" ? "bg-blue-500" :
                        "bg-yellow-500"
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {trip.pickup} → {trip.dropoff}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(trip.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">${trip.fare.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 capitalize">{trip.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Chat
          isOpen={showChat}
          conversation={conversation}
          onClose={() => setShowChat(false)}
          riderName="XXXXXXX"
          driverName="You"
          role="driver"
          user={user}
        />
      </div>
    </ProtectedRoute>
  );
}