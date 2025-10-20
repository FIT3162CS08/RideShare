"use client";

import React, { useState } from "react";
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

  function goOnline() {
    setOnline(true);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Header - Enhanced */}
        <header className="sticky top-0 z-10 glass-strong border-b border-white/30 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white grid place-items-center font-bold text-2xl shadow-lg animate-float">
              🚗
            </div>
            <div>
              <span className="font-bold text-lg gradient-text-blue">Driver Portal</span>
              <p className="text-xs text-gray-600">Manage your rides & earnings</p>
            </div>
          </div>
        </header>

        {/* Main - Enhanced */}
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {!online && !currentTrip && (
            <div className="glass-strong rounded-3xl p-10 text-center shadow-2xl border border-white/30 animate-scaleIn">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text-blue mb-2">You are offline</h1>
              <p className="text-gray-600 mb-6">Ready to start earning? Go online to accept ride requests!</p>
              <button 
                onClick={goOnline} 
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                ✓ Go Online
              </button>
            </div>
          )}

          {online && !currentTrip && (
            <div className="glass-strong rounded-3xl p-10 text-center shadow-2xl border border-white/30 animate-scaleIn">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold gradient-text-blue mb-2">You are online</h2>
              <p className="text-gray-600 mb-2">🎯 Searching for nearby ride requests...</p>
              <p className="text-sm text-gray-500 mb-6">We&apos;ll notify you when a rider needs you!</p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold gradient-text-blue">0</div>
                  <div className="text-xs text-gray-600">Today&apos;s Trips</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold gradient-text-blue">$0</div>
                  <div className="text-xs text-gray-600">Today&apos;s Earnings</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold gradient-text-blue">4.9</div>
                  <div className="text-xs text-gray-600">Your Rating</div>
                </div>
              </div>
              
              <button 
                onClick={acceptTrip} 
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                🎬 Simulate Incoming Trip
              </button>
            </div>
          )}

          {currentTrip && (
            <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/30 animate-scaleIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text-blue flex items-center gap-2">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Current Trip
                </h2>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg animate-pulse">
                  Active
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {currentTrip.rider[0]}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Rider</div>
                    <div className="font-bold text-lg">{currentTrip.rider}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Pickup</div>
                    <div className="font-semibold">{currentTrip.pickup}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Dropoff</div>
                    <div className="font-semibold">{currentTrip.dropoff}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 shadow-lg">
                  <div className="text-4xl">💰</div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Estimated Earnings</div>
                    <div className="text-3xl font-bold text-green-700">${currentTrip.fare.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={completeTrip} 
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  ✓ Complete Trip
                </button>
                <button 
                  onClick={() => setCurrentTrip(null)} 
                  className="px-6 py-4 rounded-2xl border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="max-w-6xl mx-auto px-4 py-10 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} RideShare Driver. Drive safe, earn more! 🚗💚</p>
        </footer>
      </div>
    </ProtectedRoute>  
  );
}
