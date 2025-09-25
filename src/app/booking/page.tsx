"use client";

import React, { useEffect, useMemo, useState } from "react";

// RideShare Booking Page — Web-only, localhost, no API integration
// Tailwind classes are used for styling. Plug real APIs later.

export default function RideShareBooking() {
  // Core fields
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [whenNow, setWhenNow] = useState(true);
  const [date, setDate] = useState<string>(defaultDate());
  const [time, setTime] = useState<string>(defaultTime());
  const [rideType, setRideType] = useState<"standard" | "xl" | "premium">("standard");
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [promo, setPromo] = useState("");
  const [payment, setPayment] = useState<"card" | "cash">("card");

  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  // Persist draft locally (so refreshes don’t lose inputs)
  useEffect(() => {
    const saved = localStorage.getItem("rs_booking_draft");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setPickup(d.pickup ?? "");
        setDropoff(d.dropoff ?? "");
        setWhenNow(d.whenNow ?? true);
        setDate(d.date ?? defaultDate());
        setTime(d.time ?? defaultTime());
        setRideType(d.rideType ?? "standard");
        setPassengers(d.passengers ?? 1);
        setLuggage(d.luggage ?? 0);
        setPhone(d.phone ?? "");
        setNotes(d.notes ?? "");
        setPromo(d.promo ?? "");
        setPayment(d.payment ?? "card");
      } catch {}
    }
  }, []);

  useEffect(() => {
    const draft = {
      pickup,
      dropoff,
      whenNow,
      date,
      time,
      rideType,
      passengers,
      luggage,
      phone,
      notes,
      promo,
      payment,
    };
    localStorage.setItem("rs_booking_draft", JSON.stringify(draft));
  }, [pickup, dropoff, whenNow, date, time, rideType, passengers, luggage, phone, notes, promo, payment]);

  // Fake distance estimate (since no maps yet)
  const distanceKm = useMemo(() => {
    if (!pickup || !dropoff) return 0;
    // Simple string-difference heuristic to keep things deterministic on localhost
    const s = Math.abs(pickup.length - dropoff.length) + Math.min(pickup.length, dropoff.length) * 0.1;
    return Math.max(2, Math.min(18, Math.round(s)));
  }, [pickup, dropoff]);

  const etaMin = useMemo(() => (whenNow ? Math.max(3, Math.min(12, 2 + (distanceKm % 9))) : 0), [whenNow, distanceKm]);

  const fare = useMemo(() => {
    const base = rideType === "premium" ? 7.5 : rideType === "xl" ? 5.5 : 4.0; // AUD base/km
    const start = rideType === "premium" ? 7 : rideType === "xl" ? 4 : 3; // AUD start fee
    const pplFactor = 1 + (passengers - 1) * 0.07;
    const luggageFactor = 1 + luggage * 0.03;
    const scheduleFactor = whenNow ? 1 : 1.08; // slight uplift for scheduled
    const subtotal = (start + distanceKm * base) * pplFactor * luggageFactor * scheduleFactor;
    const promoCut = promo.trim().toUpperCase() === "WELCOME10" ? 0.9 : 1; // demo code
    const gst = 0.1; // AU GST
    return Math.max(0, subtotal * promoCut * (1 + gst));
  }, [rideType, passengers, luggage, whenNow, distanceKm, promo]);

  const valid = useMemo(() => {
    // Simple AU-style phone check without regex: accept numbers with optional + and spaces
    const compact = phone.split(" ").join("");
    const startsOk = compact.startsWith("+61") || compact.startsWith("0");
    const digits = Array.from(compact).filter(ch => "0123456789".includes(ch)).join("");
    const lengthOk = digits.length >= 9 && digits.length <= 11; // broad demo bounds
    if (!pickup || !dropoff || !startsOk || !lengthOk) return false;
    if (!whenNow && (!date || !time)) return false;
    return true;
  }, [pickup, dropoff, phone, whenNow, date, time]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    // No API: just mock a booking reference & show confirmation
    setTimeout(() => {
      const ref = "RS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      setBookingRef(ref);
      setShowConfirm(true);
      setSubmitting(false);
    }, 900);
  }

  function resetForm() {
    setPickup("");
    setDropoff("");
    setWhenNow(true);
    setDate(defaultDate());
    setTime(defaultTime());
    setRideType("standard");
    setPassengers(1);
    setLuggage(0);
    setPhone("");
    setNotes("");
    setPromo("");
    setPayment("card");
    localStorage.removeItem("rs_booking_draft");
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
          <div className="text-sm text-slate-600">Booking (localhost demo)</div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6">
          <h1 className="text-2xl font-semibold mb-4">Book a ride</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Locations */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pickup Location</label>
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g., 26 Sir John Monash Dr, Caulfield"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
                <div className="mt-2 text-xs text-slate-500">
                  Popular Monash locations:
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button 
                      type="button"
                      onClick={() => setPickup("Monash University Clayton Campus")}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200"
                    >
                      Clayton
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPickup("Monash University Caulfield Campus")}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200"
                    >
                      Caulfield
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPickup("Monash University Peninsula Campus")}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200"
                    >
                      Peninsula
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dropoff Location</label>
                <input
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="e.g., 14 Innovation Walk, Clayton"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
                <div className="mt-2 text-xs text-slate-500">
                  Popular destinations:
                  <div className="flex flex-wrap gap-1 mt-1">
                    <button 
                      type="button"
                      onClick={() => setDropoff("Monash University Clayton Campus")}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200"
                    >
                      Clayton
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDropoff("Monash University Caulfield Campus")}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200"
                    >
                      Caulfield
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDropoff("Monash University Peninsula Campus")}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200"
                    >
                      Peninsula
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <span className="block text-sm font-medium mb-1">When</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setWhenNow(true)}
                    className={`px-3 py-2 rounded-2xl border ${whenNow ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}
                  >
                    Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhenNow(false)}
                    className={`px-3 py-2 rounded-2xl border ${!whenNow ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}
                  >
                    Schedule
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={whenNow}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={whenNow}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Ride prefs */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Passengers</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value || "1"))}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Luggage</label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={luggage}
                  onChange={(e) => setLuggage(parseInt(e.target.value || "0"))}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ride type</label>
                <select
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                >
                  <option value="standard">Standard</option>
                  <option value="xl">XL</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            {/* Contact & extras */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 04xx xxx xxx or +61 …"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
                <p className="text-xs text-slate-500 mt-1">AU format accepted (0… or +61…)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Promo code</label>
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Try WELCOME10"
                  className="w-full rounded-2xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes for driver (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Meet at the main gate, I have a stroller, etc."
                rows={3}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2"
              />
            </div>

            {/* Payment */}
            <div>
              <span className="block text-sm font-medium mb-1">Payment method</span>
              <div className="flex gap-3">
                <label className={`px-3 py-2 rounded-2xl border cursor-pointer ${payment === "card" ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}>
                  <input type="radio" name="pay" className="mr-2" checked={payment === "card"} onChange={() => setPayment("card")} />
                  Card (demo)
                </label>
                <label className={`px-3 py-2 rounded-2xl border cursor-pointer ${payment === "cash" ? "border-slate-900 bg-slate-50" : "border-slate-300"}`}>
                  <input type="radio" name="pay" className="mr-2" checked={payment === "cash"} onChange={() => setPayment("cash")} />
                  Cash
                </label>
              </div>
            </div>

            {/* Fare Estimation - Enhanced */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Fare Estimate</h3>
                <div className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Live Pricing
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">${fare.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total (incl. GST)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="font-semibold">{distanceKm} km</div>
                  <div className="text-sm text-gray-600">Ride Type</div>
                  <div className="font-semibold capitalize">{rideType}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base fare</span>
                  <span>${rideType === "premium" ? "7.00" : rideType === "xl" ? "4.00" : "3.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance ({distanceKm} km)</span>
                  <span>${((rideType === "premium" ? 7.5 : rideType === "xl" ? 5.5 : 4.0) * distanceKm).toFixed(2)}</span>
                </div>
                {passengers > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers ({passengers})</span>
                    <span>+{((passengers - 1) * 0.07 * 100).toFixed(0)}%</span>
                  </div>
                )}
                {luggage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Luggage ({luggage})</span>
                    <span>+{(luggage * 0.03 * 100).toFixed(0)}%</span>
                  </div>
                )}
                {!whenNow && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheduled ride</span>
                    <span>+8%</span>
                  </div>
                )}
                {promo.trim().toUpperCase() === "WELCOME10" && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount (WELCOME10)</span>
                    <span>-10%</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total (incl. GST)</span>
                  <span>${fare.toFixed(2)} AUD</span>
                </div>
              </div>

              {whenNow ? (
                <div className="mt-3 text-center text-sm text-blue-600">
                  🚗 Driver ETA: ~{etaMin} minutes
                </div>
              ) : (
                <div className="mt-3 text-center text-sm text-blue-600">
                  📅 Scheduled for {date} at {time}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="text-sm text-slate-600">
                <div>Final fare may vary based on traffic and route</div>
                <div className="text-xs mt-1">Payment will be processed after ride completion</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={!valid || submitting}
                  className="px-6 py-2 rounded-2xl bg-slate-900 text-white disabled:opacity-60 hover:bg-slate-800 transition-colors"
                >
                  {submitting ? "Booking…" : "Book ride"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Summary */}
        <aside className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6 h-fit">
          <h2 className="text-lg font-semibold mb-3">Trip summary</h2>
          <ul className="text-sm space-y-2">
            <li><span className="text-slate-500">Pickup: </span><span className="font-medium">{pickup || "—"}</span></li>
            <li><span className="text-slate-500">Dropoff: </span><span className="font-medium">{dropoff || "—"}</span></li>
            <li><span className="text-slate-500">Distance: </span><span className="font-medium">{distanceKm ? `${distanceKm} km (demo)` : "—"}</span></li>
            <li><span className="text-slate-500">When: </span><span className="font-medium">{whenNow ? `Now (ETA ~${etaMin} min)` : `${date} ${time}`}</span></li>
            <li><span className="text-slate-500">Ride type: </span><span className="font-medium capitalize">{rideType}</span></li>
            <li><span className="text-slate-500">Passengers: </span><span className="font-medium">{passengers}</span></li>
            <li><span className="text-slate-500">Luggage: </span><span className="font-medium">{luggage}</span></li>
            <li><span className="text-slate-500">Payment: </span><span className="font-medium capitalize">{payment}</span></li>
          </ul>
          <div className="mt-4 pt-4 border-t border-slate-200 text-sm">
            <div className="flex justify-between"><span>Fare (incl. GST)</span><span className="font-semibold">${fare.toFixed(2)}</span></div>
            <p className="text-xs text-slate-500 mt-2">Estimates only. Replace with server quotes once APIs are wired.</p>
          </div>
        </aside>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-20 bg-black/40 grid place-items-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
            <h3 className="text-xl font-semibold">Booking confirmed (demo)</h3>
            <p className="text-sm text-slate-600 mt-1">No backend yet—this is a local confirmation to help test the UI.</p>
            <div className="mt-4 space-y-2 text-sm">
              <div><span className="text-slate-500">Ref: </span><span className="font-mono font-medium">{bookingRef}</span></div>
              <div><span className="text-slate-500">Pickup: </span>{pickup}</div>
              <div><span className="text-slate-500">Dropoff: </span>{dropoff}</div>
              <div><span className="text-slate-500">When: </span>{whenNow ? `Now (ETA ~${etaMin} min)` : `${date} ${time}`}</div>
              <div><span className="text-slate-500">Fare est.: </span>${fare.toFixed(2)} AUD</div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-2xl border border-slate-300">Close</button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  window.location.href = '/trip';
                }}
                className="px-4 py-2 rounded-2xl bg-slate-900 text-white"
              >
                View Trip
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

function defaultDate() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10);
  return d.toISOString().slice(0, 10);
}
function defaultTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
