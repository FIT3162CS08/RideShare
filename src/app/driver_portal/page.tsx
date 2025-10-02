"use client";

import React, { useState } from "react";
import Chat from "@/component/Chat";
import ProtectedRoute from "@/component/ProtectedRoute";

// Driver Portal — localhost demo
export default function DriverPortalPage() {
  const [online, setOnline] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<null | {
    rider: string;
    pickup: string;
    dropoff: string;
    fare: number;
  }>(null);
  const [showChat, setShowChat] = useState(false);

  function goOnline() {
    setOnline(true);
  }

  function goOffline() {
    setOnline(false);
    setCurrentTrip(null);
  }

  function acceptTrip() {
    setCurrentTrip({
      rider: "Mahdee I.",
      pickup: "26 Sir John Monash Dr, Caulfield",
      dropoff: "14 Innovation Walk, Clayton",
      fare: 23.75,
    });
  }

  function completeTrip() {
    setCurrentTrip(null);
    alert("Trip completed. Earnings added. (demo)");
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">RS</div>
              <span className="font-semibold tracking-tight">Driver Portal</span>
            </div>
            <div className="flex items-center gap-4">
              {online && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Online</span>
                </div>
              )}
              {currentTrip && (
                <button
                  onClick={() => setShowChat(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {!online && !currentTrip && (
            <div className="bg-white rounded-3xl border p-6 text-center">
              <h1 className="text-2xl font-semibold mb-4">You are offline</h1>
              <p className="text-gray-600 mb-6">
                Go online to start receiving ride requests from students and staff.
              </p>
              <button 
                onClick={goOnline} 
                className="px-6 py-3 rounded-2xl bg-green-600 text-white text-lg hover:bg-green-700 transition-colors"
              >
                Go Online
              </button>
            </div>
          )}

          {online && !currentTrip && (
            <div className="bg-white rounded-3xl border p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">You are online</h2>
              <p className="text-slate-600">Waiting for nearby ride requests…</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={acceptTrip} 
                  className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Simulate Incoming Trip
                </button>
                <button 
                  onClick={goOffline} 
                  className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Go Offline
                </button>
              </div>
            </div>
          )}

          {currentTrip && (
            <div className="bg-white rounded-3xl border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Current Trip</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChat(true)}
                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat with Rider
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{currentTrip.rider}</div>
                      <div className="text-sm text-gray-500">Rider</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-500">Pickup:</span>
                      <span className="font-medium">{currentTrip.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-500">Dropoff:</span>
                      <span className="font-medium">{currentTrip.dropoff}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">${currentTrip.fare.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Estimated Fare</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={completeTrip} 
                  className="flex-1 px-4 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Complete Trip
                </button>
                <button 
                  onClick={() => setCurrentTrip(null)} 
                  className="px-4 py-3 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Driver Stats */}
          <div className="bg-white rounded-3xl border p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-500">Trips Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$67.50</div>
                <div className="text-sm text-gray-500">Earnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Modal */}
        <Chat
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          riderName={currentTrip?.rider || "Rider"}
          driverName="You"
          role="driver"
        />

        <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} RideShare Driver. Localhost demo.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
