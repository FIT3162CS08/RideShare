"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type MeUser = { id: string; email: string; name?: string };

export default function HomePage() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [checked, setChecked] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include", // send cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        }
      } catch {
        // ignore – stay logged out UI
      } finally {
        setChecked(true);
      }
    };
    check();
  }, [API_BASE]);

  // While checking, show the logged-out version (or a tiny skeleton if you prefer)
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
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

  // Logged-in view (simple prototype)
  return (
    <section className="px-8 md:px-20 lg:px-40 py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            Welcome{user?.name ? `, ${user.name}` : ""} 👋
          </h1>
          <form
            action={`${API_BASE}/auth/logout`}
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              fetch(`${API_BASE}/auth/logout`, {
                method: "POST",
                credentials: "include",
              }).then(() => location.reload());
            }}
          >
            <button className="px-4 py-2 rounded-lg border hover:bg-gray-50">
              Log out
            </button>
          </form>
        </div>

        {/* Quick request form */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Request a ride</h2>
          <input
            type="text"
            placeholder="Pick-up location"
            className="w-3/4 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Campus"
            className="w-3/4 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Date & time"
            className="w-3/4 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <div>
            <button className="text-base px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
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