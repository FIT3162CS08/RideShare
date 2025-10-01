"use client";

import React, { useEffect, useRef, useState } from "react";

export default function RideShareSettings() {
  const defaultProfile = {
    savedName: "John Doe",
    savedPhone: "0412 345 678",
    email: "johndoe@example.com",
    birthday: "1990-01-01",
    promoCode: "WELCOME10",
    profilePic: null as string | null,
    address: "123 Main St, Melbourne VIC",
    notifications: true,
    saveReceipts: true,
    defaultPayment: "card" as "card" | "cash",
  };

  const [savedName, setSavedName] = useState(defaultProfile.savedName);
  const [savedPhone, setSavedPhone] = useState(defaultProfile.savedPhone);
  const [email, setEmail] = useState(defaultProfile.email);
  const [birthday, setBirthday] = useState(defaultProfile.birthday);
  const [promoCode, setPromoCode] = useState(defaultProfile.promoCode);
  const [profilePic, setProfilePic] = useState<string | null>(
    defaultProfile.profilePic
  );
  const [address, setAddress] = useState(defaultProfile.address);

  const [notifications, setNotifications] = useState(
    defaultProfile.notifications
  );
  const [saveReceipts, setSaveReceipts] = useState(
    defaultProfile.saveReceipts
  );
  const [defaultPayment, setDefaultPayment] = useState<"card" | "cash">(
    defaultProfile.defaultPayment
  );

  const [saved, setSaved] = useState(false);

  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteObj = useRef<google.maps.places.Autocomplete | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autocompleteRef.current && !autocompleteObj.current) {
      autocompleteObj.current = new google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "au" },
        }
      );
      autocompleteObj.current.addListener("place_changed", () => {
        const place = autocompleteObj.current?.getPlace();
        if (place?.formatted_address) {
          setAddress(place.formatted_address);
        }
      });
    }
  }, []);

  function handleProfilePicChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePic(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function handleReset() {
    setSavedName(defaultProfile.savedName);
    setSavedPhone(defaultProfile.savedPhone);
    setEmail(defaultProfile.email);
    setBirthday(defaultProfile.birthday);
    setPromoCode(defaultProfile.promoCode);
    setProfilePic(defaultProfile.profilePic);
    setAddress(defaultProfile.address);
    setNotifications(defaultProfile.notifications);
    setSaveReceipts(defaultProfile.saveReceipts);
    setDefaultPayment(defaultProfile.defaultPayment);
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
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
          <div className="text-sm text-slate-600">Settings (localhost demo)</div>
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
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birthday</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border border-slate-300 overflow-hidden">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-slate-100 text-slate-400">
                      No Image
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-50 text-sm"
                >
                  Choose Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                ref={autocompleteRef}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Search your address"
                className="w-full rounded-2xl border border-slate-300 px-3 py-2"
              />
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Promo Code
              </label>
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2"
              />
            </div>
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
              <span className="text-sm text-green-600 self-center">Saved!</span>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} RideShare. Web-only localhost demo.</div>
      </footer>
    </div>
  );
}

// fix the no file chosen part to be only until save, or if no photo there, and make the choose more like a button