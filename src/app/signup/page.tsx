"use client";

import AutocompleteInput from "@/component/AutocompleteInput";
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
  const [location, setLocation] = useState<google.maps.places.PlaceResult | null>(null);
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
      const suffix = "@student.monash.edu"
      const suffixLen = suffix.length
      const prefixLen = email.length-suffixLen+1

      for (let i = email.length-1; 0 < i && prefixLen < i && i < email.length; i--) {
        if (email[i] != suffix[i-prefixLen+1]) {
          setError("Must use Monash email")
          return
        }
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

    if (address != location?.formatted_address) {
      setError("Please select an address from the suggestions.");
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
    <section className="min-h-screen flex items-center justify-center py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4 animate-scaleIn">
        {/* Glassmorphism Card with Premium Effects */}
        <div className="glass-gradient rounded-3xl p-8 shadow-2xl border-2 border-white/50 card-premium">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl animate-float animate-color-shift animate-ripple">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text-blue mb-2">Create your account</h1>
            <p className="text-gray-600">Join RideShare today – It only takes a minute!</p>
          </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                placeholder="+61 xxx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <AutocompleteInput
              placeholder="Your home address"
              value={address}
              onChange={setAddress}
              setLocation={setLocation}
              required
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
            <input
              type="date"
              placeholder="Birthday"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all shadow-sm"
              />
            </div>
          </div>

          {error && (
            <div className="animate-fadeIn">
              <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group animate-shimmer relative overflow-hidden"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 rounded-full">Already have an account?</span>
            </div>
          </div>

          <Link href="/login">
            <button
              type="button"
              className="w-full rounded-2xl bg-white border-2 border-gray-300 px-6 py-4 text-gray-800 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all hover:border-purple-400"
            >
              Log in instead
            </button>
          </Link>
        </form>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sm text-gray-600">
          By signing up, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
        </p>
      </div>
    </section>
  );
}
