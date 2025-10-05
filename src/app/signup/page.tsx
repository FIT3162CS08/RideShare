"use client";

import { validateBirthday, validateEmail, validateLettersOnly, validatePhoneNumber } from "@/util/ValidationHelpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = '/api'; //process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Name validation
    if (name) {
      const nameError = validateLettersOnly(name);
      if (nameError) {
        setError(nameError + " in name");
        return;
      }
    }

    // Email validation
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) {
        setError(emailError);
        return;
      }
    }

    // Phone validation
    if (phone) {
      const phoneError = validatePhoneNumber(phone);
      if (phoneError) {
        setError(phoneError);
        return;
      }
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // Birthday validation
    if (birthday) {
      const BirthdayError = validateBirthday(birthday);
      if (BirthdayError) {
        setError(BirthdayError);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, birthday, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Sign up failed");
        return;
      }

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
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-sm text-gray-600 mb-6">It only takes a minute</p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Creating account…" : "Sign up"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
