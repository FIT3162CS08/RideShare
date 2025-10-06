"use client";

import React, { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/component/ProtectedRoute";
import AutocompleteInput from "@/component/AutocompleteInput";
import TextInput from "@/component/TextInput";
import {
  validateRequired,
  validatePhoneNumber,
  validateEmail,
  combineValidators,
  validateLettersOnly,
  validateBirthday,
} from "@/util/ValidationHelpers";
import { useUser } from "@/context/UserContext";

export default function RideShareSettings() {
  const {user, refreshUser} = useUser();
  const userData = user!
  console.log(userData)
  if (!user) return;

  const [name, setSavedName] = useState(userData.name);
  const [phone, setPhone] = useState(userData.phone);
  const [email, setEmail] = useState(userData.email);
  const [birthday, setBirthday] = useState(userData.birthday);
  const [promoCode, setPromoCode] = useState("");
  const [address, setAddress] = useState(userData.address);
  const [googleLoc, setGLoc] = useState<google.maps.places.PlaceResult | null>(null);

  const [notifications, setNotifications] = useState(
    userData.pushNotifs
  );
  const [saveReceipts, setSaveReceipts] = useState(
    userData.saveReceipts
  );
  const [defaultPayment, setDefaultPayment] = useState<"card" | "cash">(
    userData.card ? "card" : "cash"
  );

  const [saved, setSaved] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  function validateAll() {
    const newErrors = {
      savedName: combineValidators(validateRequired("Name"), validateLettersOnly)(name),
      savedPhone: validatePhoneNumber(phone),
      email: validateEmail(email),
      birthday: validateBirthday(birthday),
      address: validateRequired("Address")(address) || (address == googleLoc?.formatted_address ? null : "Please select an address from the dropdown"),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  }

  async function handleReset() {
    await refreshUser();
    setSaved(false);
    setErrors({});
    setShowErrors(false);
  }

  useEffect(() => {
    if (userData) {
      setSavedName(userData.name);
      setPhone(userData.phone);
      setEmail(userData.email);
      setBirthday(userData.birthday);
      setAddress(userData.address);
      setNotifications(userData.pushNotifs);
      setSaveReceipts(userData.saveReceipts);
      setDefaultPayment(userData.card ? "card" : "cash");
    }
  }, [userData]);

  async function handleSave() {
    setShowErrors(true);
    if (!validateAll()) return;

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          birthday,
          address,
          pushNotifs: notifications,
          saveReceipts,
          card: defaultPayment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">
                RS
              </div>
              <span className="font-semibold tracking-tight">RideShare</span>
            </div>
            <div className="text-sm text-slate-600">
              Settings (localhost demo)
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6 space-y-6">
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>

            {/* Profile */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <TextInput
                  label="Name"
                  value={name}
                  onChange={setSavedName}
                  error={errors.savedName}
                  showErrors={showErrors}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
                <TextInput
                  label="Phone"
                  value={phone}
                  onChange={setPhone}
                  error={errors.savedPhone}
                  showErrors={showErrors}
                  placeholder="e.g., 04xx xxx xxx"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
                <TextInput
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  showErrors={showErrors}
                  placeholder="e.g., user@example.com"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
                <TextInput
                  label="Birthday"
                  type="date"
                  value={birthday}
                  onChange={setBirthday}
                  error={errors.birthday}
                  showErrors={showErrors}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>

              {/* Address */}
              <AutocompleteInput
                label="Address"
                value={address}
                onChange={setAddress}
                setLocation={setGLoc}
                placeholder="Search your address"
                error={errors.address}
                showErrors={showErrors}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2"
              />

              {/* Promo Code */}
              <TextInput
                label="Promo Code"
                value={promoCode}
                onChange={setPromoCode}
                placeholder="Try WELCOME10"
                className="w-full rounded-2xl border border-slate-300 px-3 py-2"
              />
            </div>

            {/* Preferences */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Preferences</h2>
              <div className="text-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span>Push notifications</span>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Save receipts to email</span>
                  <button
                    onClick={() => setSaveReceipts(!saveReceipts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      saveReceipts ? "bg-slate-900" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        saveReceipts ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-xl font-semibold">Payment</h2>
              <div className="flex gap-3 text-sm mt-2">
                <label
                  className={`px-3 py-2 rounded-2xl border cursor-pointer ${
                    defaultPayment === "card"
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-300"
                  }`}
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
                  className={`px-3 py-2 rounded-2xl border cursor-pointer ${
                    defaultPayment === "cash"
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-300"
                  }`}
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

            {/* Save & Reset */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded-2xl border border-slate-300 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
              >
                Save
              </button>
              {saved && (
                <span className="text-sm text-green-600 self-center">
                  Saved!
                </span>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} RideShare. Web-only localhost demo.
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
