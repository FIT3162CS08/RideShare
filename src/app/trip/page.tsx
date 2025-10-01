"use client";

import React, { useEffect, useRef, useState } from "react";
import Chat from "@/component/Chat";
import ProtectedRoute from "@/component/ProtectedRoute";

// Trip Page - Rider's view of their active trip
export default function TripPage() {
  const [tripStatus, setTripStatus] = useState<"waiting" | "picked_up" | "completed">("waiting");
  const [showChat, setShowChat] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const trip = {
    id: "RS-ABC123",
    driver: "John D.",
    driverRating: 4.8,
    vehicle: "Blue Toyota Camry - ABC123",
    pickup: {
      formatted_address: "26 Sir John Monash Dr, Caulfield East VIC 3145, Australia",
      location: {
        lat: -37.8774408,
        lng: 145.0435147
      },
      place_id: "ChIJzdMzrIxp1moRlxwupvPUt94",
    },
    dropoff: {
      formatted_address: "14 Innovation Walk, Clayton VIC 3168, Australia",
      location: {
          "lat": -37.9103577,
          "lng": 145.13009
      },
      place_id: "Ei8xNCBJbm5vdmF0aW9uIFdhbGssIENsYXl0b24gVklDIDMxNjgsIEF1c3RyYWxpYSIwEi4KFAoSCY0bOiTJatZqETmYbG1kGa_GEA4qFAoSCVFqpiPJatZqEXhD6l2H9fCT",
    },
    fare: 23.75,
    eta: 3
  };

  function markPickedUp() {
    setTripStatus("picked_up");
  }

  function completeTrip() {
    setTripStatus("completed");
  }

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: -37.877, lng: 145.045 }, // Rough midpoint between Caulfield and Clayton
    });

    const directionsService = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer();
    directionsRendererRef.current.setMap(map);

    directionsService.route(
      {
        origin: trip.pickup.location,
        destination: trip.dropoff.location,
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
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
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

        {/* Main */}
        <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {/* Trip Status */}
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
                {tripStatus === "waiting" && `ETA: ${trip.eta} minutes`}
                {tripStatus === "picked_up" && "Enjoy your ride!"}
                {tripStatus === "completed" && "Thank you for using RideShare!"}
              </p>
            </div>

            {/* Driver Info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{trip.driver}</div>
                  <div className="text-sm text-gray-500">{trip.vehicle}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{trip.driverRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Pickup</div>
                  <div className="text-sm text-gray-500">{trip.pickup.formatted_address}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Dropoff</div>
                  <div className="text-sm text-gray-500">{trip.dropoff.formatted_address}</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-72 rounded-2xl overflow-hidden mb-6">
              <div ref={mapRef} className="w-full h-full" />
            </div>

            {/* Trip Actions */}
            <div className="mt-6 space-y-3">
              {tripStatus === "waiting" && (
                <button
                  onClick={markPickedUp}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  Mark as Picked Up (Demo)
                </button>
              )}
              {tripStatus === "picked_up" && (
                <button
                  onClick={completeTrip}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors"
                >
                  Complete Trip (Demo)
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
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">
                    Rate & Review Driver
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trip Info */}
          <div className="bg-white rounded-3xl border p-6">
            <h3 className="text-lg font-semibold mb-4">Trip Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Trip ID</span>
                <span className="font-mono">{trip.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Fare</span>
                <span className="font-semibold">${trip.fare.toFixed(2)} AUD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span>Card ending in 1234</span>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Modal */}
        <Chat
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          riderName="You"
          driverName={trip.driver}
          role="rider"
        />

        <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500 text-center">
          © {new Date().getFullYear()} RideShare. Localhost demo.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
