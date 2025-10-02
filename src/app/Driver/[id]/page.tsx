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
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">RS</div>
            <span className="font-semibold tracking-tight">Driver Portal</span>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {!online && !currentTrip && (
            <div className="bg-white rounded-3xl border p-6 text-center">
              <h1 className="text-2xl font-semibold mb-4">You are offline</h1>
              <button onClick={goOnline} className="px-6 py-3 rounded-2xl bg-green-600 text-white text-lg">
                Go Online
              </button>
            </div>
          )}

          {online && !currentTrip && (
            <div className="bg-white rounded-3xl border p-6 text-center space-y-4">
              <h2 className="text-xl font-semibold">You are online</h2>
              <p className="text-slate-600">Waiting for nearby ride requests…</p>
              <button onClick={acceptTrip} className="px-5 py-3 rounded-2xl bg-slate-900 text-white">
                Simulate Incoming Trip
              </button>
            </div>
          )}

          {currentTrip && (
            <div className="bg-white rounded-3xl border p-6 space-y-4">
              <h2 className="text-xl font-semibold">Current Trip</h2>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-500">Rider: </span>{currentTrip.rider}</div>
                <div><span className="text-slate-500">Pickup: </span>{currentTrip.pickup}</div>
                <div><span className="text-slate-500">Dropoff: </span>{currentTrip.dropoff}</div>
                <div><span className="text-slate-500">Fare: </span>${currentTrip.fare.toFixed(2)} AUD</div>
              </div>
              <div className="flex gap-3">
                <button onClick={completeTrip} className="px-4 py-2 rounded-2xl bg-green-600 text-white">
                  Complete Trip
                </button>
                <button onClick={() => setCurrentTrip(null)} className="px-4 py-2 rounded-2xl border">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} RideShare Driver. Localhost demo.
        </footer>
      </div>
    </ProtectedRoute>  
  );
}
