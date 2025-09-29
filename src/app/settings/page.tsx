"use client";

import React, { useEffect, useState } from "react";

// RideShare Settings Page — Web-only, localhost, no API integration
// Tailwind classes are used for styling. Plug real APIs later.

export default function RideShareSettings() {
  // Profile fields
  const [savedName, setSavedName] = useState("John Doe");
  const [savedPhone, setSavedPhone] = useState("0412 345 678");
  const [address, setAddress] = useState("123 Main St");
  const [city, setCity] = useState("Melbourne");
  const [country, setCountry] = useState("Australia");

  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [saveReceipts, setSaveReceipts] = useState(true);
  const [defaultPayment, setDefaultPayment] = useState<"card" | "cash">("card");

  // Save state
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rs_settings");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setSavedName(d.savedName ?? "John Doe");
        setSavedPhone(d.savedPhone ?? "0412 345 678");
        setAddress(d.address ?? "123 Main St");
        setCity(d.city ?? "Melbourne");
        setCountry(d.country ?? "Australia");
        setNotifications(d.notifications ?? true);
        setSaveReceipts(d.saveReceipts ?? true);
        setDefaultPayment(d.defaultPayment ?? "card");
      } catch {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const draft = {
      savedName,
      savedPhone,
      address,
      city,
      country,
      notifications,
      saveReceipts,
      defaultPayment,
    };
    localStorage.setItem("rs_settings", JSON.stringify(draft));
  }, [savedName, savedPhone, address, city, country, notifications, saveReceipts, defaultPayment]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowConfirm(true);
    }, 600);
  }

  function resetSettings() {
    setSavedName("John Doe");
    setSavedPhone("0412 345 678");
    setAddress("123 Main St");
    setCity("Melbourne");
    setCountry("Australia");
    setNotifications(true);
    setSaveReceipts(true);
    setDefaultPayment("card");
    localStorage.removeItem("rs_settings");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">RS</div>
            <span className="font-semibold tracking-tight">RideShare</span>
          </div>
          <div className="text-sm text-slate-600">Settings (localhost demo)</div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-2xl font-semibold mb-4">App Settings</h1>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile */}
            <div>
              <h2 className="text-lg font-medium mb-3">Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    value={savedName}
                    onChange={(e) => setSavedName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    value={savedPhone}
                    onChange={(e) => setSavedPhone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h2 className="text-lg font-medium mb-3">Preferences</h2>

              {/* Notifications */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 flex items-center rounded-full ${notifications ? "bg-green-500" : "bg-slate-300"} transition`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transform transition ${notifications ? "translate-x-6" : "translate-x-1"}`}
                  ></div>
                </button>
              </div>

              {/* Save receipts */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Save receipts to email</span>
                <button
                  type="button"
                  onClick={() => setSaveReceipts(!saveReceipts)}
                  className={`w-12 h-6 flex items-center rounded-full ${saveReceipts ? "bg-green-500" : "bg-slate-300"} transition`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transform transition ${saveReceipts ? "translate-x-6" : "translate-x-1"}`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-lg font-medium mb-3">Default Payment</h2>
              <div className="flex gap-3">
                <label
                  className={`px-3 py-2 rounded-2xl border cursor-pointer ${defaultPayment === "card" ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="mr-2"
                    checked={defaultPayment === "card"}
                    onChange={() => setDefaultPayment("card")}
                  />
                  Card
                </label>
                <label
                  className={`px-3 py-2 rounded-2xl border cursor-pointer ${defaultPayment === "cash" ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="mr-2"
                    checked={defaultPayment === "cash"}
                    onChange={() => setDefaultPayment("cash")}
                  />
                  Cash
                </label>
              </div>
            </div>

            {/* Save / Reset */}
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="text-sm text-slate-600">Your preferences are saved locally for now.</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetSettings}
                  className="px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-2xl bg-slate-900 text-white disabled:opacity-60 hover:bg-slate-800 transition-colors"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-20 bg-black/40 grid place-items-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
            <h3 className="text-xl font-semibold">Settings saved (demo)</h3>
            <p className="text-sm text-slate-600 mt-1">Your changes are stored locally in your browser.</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-2xl bg-slate-900 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} RideShare. Web-only localhost demo.</div>
      </footer>
    </div>
  );
}
