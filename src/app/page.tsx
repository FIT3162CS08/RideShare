"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import Loading from "@/component/Loading";
import AutocompleteInput from "@/component/AutocompleteInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSocket from "./../socket/useSocket";

type Trip = {
  _id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: string;
  createdAt: string;
  driverId?: string;
  riderId?: string;
};

function TripHistorySection() {
  const { user } = useUser();
  const [tripHistory, setTripHistory] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchTripHistory();
    }
  }, [user?._id]);

  const fetchTripHistory = async () => {
    try {
      const res = await fetch(`/api/users/${user?._id}/trip-history`);
      if (res.ok) {
        const data = await res.json();
        setTripHistory(data.tripHistory || []);
      }
    } catch (error) {
      console.error("Error fetching trip history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/30 animate-slideInUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text-blue flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Trips
        </h2>
        {/* <Link href="/trip" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View All →
        </Link> */}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : tripHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">No trips yet</p>
          <p className="text-sm text-gray-400 mt-1">Your trip history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {tripHistory.slice(0, 5).map((trip) => (
            <div key={trip._id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
  );
}

export default function HomePage() {
  const { user, loading, logout, setPickupContext, setDropoffContext } = useUser();
  const [totalTrips, setTotalTrips] = useState<number>(0);
  const [pickup, setPickup] = useState("");
  const [pickupLoc, setPickupLoc] = useState<google.maps.places.PlaceResult | null>(null);
  const [dropoff, setDropoff] = useState("");
  const [dropoffLoc, setDropoffLoc] = useState<google.maps.places.PlaceResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { isConnected, transport } = useSocket();

  const router = useRouter();

    useEffect(() => {
    const fetchTripCount = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`/api/users/${user._id}/trip-history`);
        if (res.ok) {
          const data = await res.json();
          setTotalTrips(data.tripHistory?.length || 0);
        }
      } catch (err) {
        console.error("Error fetching trip count:", err);
      }
    };

    fetchTripCount();
  }, [user?._id]);

  if (loading) return Loading();

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-20 lg:px-40 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8 animate-slideInLeft">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-medium text-sm shadow-lg">
                    ✨ Welcome to the Future of Campus Travel
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  Travel to campus with{" "}
                  <span className="gradient-text-blue">RideShare</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Your journey, simplified. Safe, affordable, and eco-friendly rides to campus.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="group">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Log in to your account
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-gray-800 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-gray-200 hover:border-purple-300">
                    Create account
                  </button>
                </Link>
              </div>

              {/* Features List */}
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full max-w-6xl mx-auto col-span-full">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl shadow-lg">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Safe</div>
                    <div className="text-sm text-gray-600">Verified drivers</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
                    💰
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Affordable</div>
                    <div className="text-sm text-gray-600">Best prices</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
                    🌱
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">Eco-friendly</div>
                    <div className="text-sm text-gray-600">Share rides</div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Right Column - Image */}
            <div className="relative animate-slideInRight">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative">
                <Image
                  src="/homepage.png"
                  alt="Uni Students illustration"
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            {[
              { value: "50K+", label: "Happy Students" },
              { value: "100K+", label: "Rides Completed" },
              { value: "200+", label: "Verified Drivers" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all card-hover">
                <div className="text-3xl md:text-4xl font-bold gradient-text-blue mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function validateLocations() {
    const newErrors = {
      pickup: !pickup ? null : (pickup == pickupLoc?.formatted_address ? null : "Please select an address from the dropdown"),
      dropoff: !dropoff ? null : (dropoff == dropoffLoc?.formatted_address ? null : "Please select an address from the dropdown"),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  }

  function onFindRides() {
    setShowErrors(true);
    if (!validateLocations()) return;
    setPickupContext(pickupLoc);
    setDropoffContext(dropoffLoc);
    console.log("Finding rides from", pickup, "to", dropoff);
    router.push("/booking");
  }

  // Logged-in view (stunning prototype)
  return (
    <section className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-8 md:px-20 lg:px-40">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="animate-fadeIn">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl animate-float animate-subtle-bounce animate-ripple">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Welcome back{user?.name ? `, ${user.name}` : ""}!
                </h1>
                <p className="text-gray-600 text-lg">Ready for your next adventure? 🚗</p>
              </div>
            </div>
          </div>

          {/* Quick request form - Enhanced */}
          <div className="glass-gradient rounded-3xl p-8 shadow-2xl animate-scaleIn card-premium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
                🎯
              </div>
              <h2 className="text-2xl font-bold gradient-text-blue">Request a ride</h2>
            </div>
            
            <div className="space-y-4">
              <AutocompleteInput
                placeholder="📍 Pick-up location"
                value={pickup}
                onChange={setPickup}
                setLocation={setPickupLoc}
                error={errors.pickup}
                showErrors={showErrors}
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
              />
              <AutocompleteInput
                placeholder="🏁 Destination"
                value={dropoff}
                onChange={setDropoff}
                setLocation={setDropoffLoc}
                error={errors.dropoff}
                showErrors={showErrors}
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
              />
              <button 
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 group animate-shimmer relative overflow-hidden" 
                onClick={onFindRides}
              >
                <span>Find rides</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats cards - Enhanced
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInLeft">
            <div className="relative overflow-hidden rounded-3xl p-6 card-hover group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                    📅
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">Upcoming</p>
                <p className="text-4xl font-bold text-white">No rides</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 card-hover group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                    🚗
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">Total trips</p>
                <p className="text-4xl font-bold text-white">{totalTrips}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 card-hover group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                    🏫
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">Campus</p>
                <p className="text-4xl font-bold text-white">Clayton</p>
              </div>
            </div>
          </div> */}

          {/* Trip History Section */}
          <TripHistorySection />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-slideInRight">
            {[
              { icon: "🔍", label: "Find Rides", href: "/booking" },
              { icon: "🗺️", label: "My Trips", href: "/trip" },
              { icon: "👤", label: "Profile", href: "/settings" },
            ].map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="glass-strong rounded-2xl p-6 hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer text-center group">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{action.icon}</div>
                  <div className="font-semibold text-gray-800">{action.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}