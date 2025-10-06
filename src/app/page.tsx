"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import Loading from "@/component/Loading";
import AutocompleteInput from "@/component/AutocompleteInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, loading, logout, setPickupContext, setDropoffContext } = useUser();

  const [pickup, setPickup] = useState("");
  const [pickupLoc, setPickupLoc] = useState<google.maps.places.PlaceResult | null>(null);
  const [dropoff, setDropoff] = useState("");
  const [dropoffLoc, setDropoffLoc] = useState<google.maps.places.PlaceResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const router = useRouter();

  if (loading) return Loading();

  if (!user) {
    return (
      <section className="px-8 md:px-20 lg:px-40 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">
            Travel to campus with RideShare
          </h1>
          <Image
            src="/homepage.png"
            alt="Uni Students illustration"
            width={500}
            height={300}
            className="rounded-lg "
          />

          <p className="text-3xl">Log in to see your account details</p>
          <p>Request rides, view past trips, tailored suggestions and more.</p>
          <Link href="/login">
            <button className="text-xl px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
              Log in to your account
            </button>
          </Link>
          <br />
          <Link href="/signup" className="underline">
            Create account
          </Link>
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

  // Logged-in view (simple prototype)
  return (
    <section className="px-8 md:px-20 lg:px-40 py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            Welcome{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            onClick={logout}
          >
            Log out
          </button>
        </div>

        {/* Quick request form */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Request a ride</h2>
          <AutocompleteInput
            placeholder="Pick-up location"
            value={pickup}
            onChange={setPickup}
            setLocation={setPickupLoc}
            error={errors.pickup}
            showErrors={showErrors}
            className="w-3/4 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <AutocompleteInput
            placeholder="Destination"
            value={dropoff}
            onChange={setDropoff}
            setLocation={setDropoffLoc}
            error={errors.dropoff}
            showErrors={showErrors}
            className="w-3/4 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <div>
            <button className="text-base px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800" onClick={onFindRides}>
              Find rides
            </button>
          </div>
        </div>

        {/* Simple stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-600">Upcoming</p>
            <p className="text-2xl font-semibold">No rides</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-600">Total trips</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-600">Campus</p>
            <p className="text-2xl font-semibold">Clayton</p>
          </div>
        </div>
      </div>
    </section>
  );
}