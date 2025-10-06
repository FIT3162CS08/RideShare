"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export default function Login() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Set this in .env.local: NEXT_PUBLIC_API_BASE=http://localhost:5000 (your Express server)
  const API_BASE = '/api'
    // process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include", // IMPORTANT: send/receive httpOnly cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        return;
      }

      await refreshUser();

      // success → go to the public home (which will show logged-in state)
      router.push("/");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-2xl font-bold mb-2">Log in</h1>
        <p className="text-sm text-gray-600 mb-6">Please enter your details</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}