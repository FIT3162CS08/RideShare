"use client";

import { UserType } from "@/models/User";
import { createContext, useContext, useEffect, useState } from "react";

// type User = { id: string; email: string; name?: string; role?: string } | null;

type UserContextType = {
  user: UserType;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  pickup: google.maps.places.PlaceResult | null;
  dropoff: google.maps.places.PlaceResult | null;
  setPickupContext: (place: google.maps.places.PlaceResult | null) => void;
  setDropoffContext: (place: google.maps.places.PlaceResult | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
  pickup: null,
  dropoff: null,
  setPickupContext: () => {},
  setDropoffContext: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const [pickup, setPickupContext] = useState<google.maps.places.PlaceResult | null>(null);
  const [dropoff, setDropoffContext] = useState<google.maps.places.PlaceResult | null>(null);

  const API_BASE = '/api'
    // process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...');
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log('User data from API:', data.user);
        setUser(data.user || data);
        console.log('User state updated:', data.user);
      } else {
        console.log('Failed to refresh user, status:', res.status);
        setUser(null);
      }
    } catch (error) {
      console.log('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout, pickup, dropoff, setPickupContext, setDropoffContext }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
