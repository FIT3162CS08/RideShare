"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ProtectedRoute from "@/component/ProtectedRoute";
import AutocompleteInput from "@/component/AutocompleteInput";
import TextInput from "@/component/TextInput";
import { validateDate, validatePhoneNumber, validateRequired, validateTime } from "@/util/ValidationHelpers";
import { useUser } from "@/context/UserContext";

export default function RideShareBooking() {
  const { pickup: pickupContext, dropoff: dropoffContext } = useUser();

  const [pickup, setPickup] = useState(pickupContext ? pickupContext.formatted_address || "" : "");
  const [pickupLoc, setPickupLoc] = useState<google.maps.places.PlaceResult | null>(pickupContext || null);
  const [dropoff, setDropoff] = useState(dropoffContext ? dropoffContext.formatted_address || "" : "");
  const [dropoffLoc, setDropoffLoc] = useState<google.maps.places.PlaceResult | null>(dropoffContext || null);
  const mapRef = useRef<HTMLDivElement>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [distanceKm, setDistanceKm] = useState(0)
  const [durationMin, setDurationMin] = useState(0)

  const [whenNow, setWhenNow] = useState(true);
  const [date, setDate] = useState<string>(currentDate());
  const [time, setTime] = useState<string>(currentTime());
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

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [showErrors, setShowErrors] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current && (window as any).google) {
        clearInterval(interval);

        const map = new google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: -37.8136, lng: 144.9631 },
        });

        directionsRendererRef.current = new google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(map);

        updateMap();
      }

    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(pickupLoc, dropoffLoc, directionsRendererRef.current);
    updateMap();
  }, [pickupLoc, dropoffLoc]);

  const updateMap = () => {
    if (!pickupLoc || !dropoffLoc || !directionsRendererRef.current) {
      directionsRendererRef.current?.set("directions", null);
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupLoc.formatted_address!,
        destination: dropoffLoc.formatted_address!,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRendererRef.current?.setDirections(result);

          const leg = result.routes[0].legs[0];
          const distanceMeters = leg.distance?.value ?? 0; // meters
          const durationSeconds = leg.duration?.value ?? 0; // seconds

          // Convert to km and minutes
          setDistanceKm(Number((distanceMeters / 1000).toFixed(1)));
          setDurationMin(Math.ceil(durationSeconds / 60));
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }

  useEffect(() => {
    if (whenNow) {
      setDate(currentDate());
      setTime(currentTime());
    }
  }, [whenNow]);

  const validateAll = () => {
    const newErrors = {
      phone: validatePhoneNumber(phone),
      pickup: validateRequired("Pickup location")(pickup),
      dropoff: validateRequired("Dropoff location")(dropoff),
      date: whenNow ? null : validateDate(date),
      time: whenNow ? null : (new Date(date).getDate() === new Date().getDate() ? validateTime(time) : null),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const fare = useMemo(() => {
    const base = rideType === "premium" ? 7.5 : rideType === "xl" ? 5.5 : 4.0;
    const start = rideType === "premium" ? 7 : rideType === "xl" ? 4 : 3;
    const pplFactor = 1 + (passengers - 1) * 0.07;
    const luggageFactor = 1 + luggage * 0.03;
    const scheduleFactor = whenNow ? 1 : 1.08;
    const subtotal = (start + distanceKm * base) * pplFactor * luggageFactor * scheduleFactor;
    const promoCut = promo.trim().toUpperCase() === "WELCOME10" ? 0.9 : 1;
    const gst = 0.1;
    return Math.max(0, subtotal * promoCut * (1 + gst));
  }, [rideType, passengers, luggage, whenNow, distanceKm, promo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(true);
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          dropoff,
          distanceKm,
          fare,
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
        }),
      });
      if (!res.ok) throw new Error("Failed to create booking");
      const data = await res.json();
      if (data) {
        window.location.href = `/trip`;
        return;
      }
      const ref = String(data.bookingId || "").slice(-6).toUpperCase();
      setBookingRef(ref || null);
      setShowConfirm(true);
    } catch (err) {
      console.error(err);
      alert("Could not create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setPickup("");
    setPickupLoc(null);
    setDropoff("");
    setDropoffLoc(null);
    setWhenNow(true);
    setDate(currentDate());
    setTime(currentTime());
    setRideType("standard");
    setPassengers(1);
    setLuggage(0);
    setPhone("");
    setNotes("");
    setPromo("");
    setPayment("card");
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold">RS</div>
              <span className="font-semibold tracking-tight">RideShare</span>
            </div>
            <div className="text-sm text-slate-600">Booking (localhost demo)</div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6">
            <h1 className="text-2xl font-semibold mb-4">Book a ride</h1>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Locations */}
              <div className="grid sm:grid-cols-2 gap-4">
                <AutocompleteInput
                  value={pickup}
                  onChange={setPickup}
                  setLocation={setPickupLoc}
                  showErrors={showErrors}
                  error={errors.pickup}
                  placeholder="e.g., 26 Sir John Monash Dr, Caulfield"
                  label="Pickup Location"
                  className="w-full rounded-2xl border px-3 py-2"
                />
                <AutocompleteInput
                  value={dropoff}
                  onChange={setDropoff}
                  setLocation={setDropoffLoc}
                  showErrors={showErrors}
                  error={errors.dropoff}
                  placeholder="e.g., 14 Innovation Walk, Clayton"
                  label="Dropoff Location"
                  className="w-full rounded-2xl border px-3 py-2"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <span className="block text-sm font-medium mb-1">When</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWhenNow(true)}
                      className={`px-3 py-2 rounded-2xl border ${
                        whenNow ? "border-slate-900 bg-slate-50" : "border-slate-300"
                      }`}
                    >
                      Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setWhenNow(false)}
                      className={`px-3 py-2 rounded-2xl border ${
                        !whenNow ? "border-slate-900 bg-slate-50" : "border-slate-300"
                      }`}
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                <TextInput
                  label="Date"
                  type="date"
                  value={date}
                  onChange={setDate}
                  disabled={whenNow}
                  error={errors.date}
                  showErrors={showErrors}
                  className="w-full rounded-2xl border px-3 py-2 disabled:bg-slate-100"
                  labelClassName="block text-sm font-medium mb-1"
                />
                <TextInput
                  label="Time"
                  type="time"
                  value={time}
                  onChange={setTime}
                  disabled={whenNow}
                  error={errors.time}
                  showErrors={showErrors}
                  className="w-full rounded-2xl border px-3 py-2 disabled:bg-slate-100"
                  labelClassName="block text-sm font-medium mb-1"
                />
              </div>

              {/* Ride prefs */}
              <div className="grid sm:grid-cols-3 gap-4">
                <TextInput
                  label="Passengers"
                  type="number"
                  value={String(passengers)}
                  onChange={(val) => setPassengers(parseInt(val || "1"))}
                  min={1}
                  max={6}
                  required
                  showErrors={showErrors}
                  className="w-full rounded-2xl border px-3 py-2"
                  labelClassName="block text-sm font-medium mb-1"
                />
                <TextInput
                  label="Luggage"
                  type="number"
                  value={String(luggage)}
                  onChange={(val) => setLuggage(parseInt(val || "0"))}
                  min={0}
                  max={6}
                  showErrors={showErrors}
                  className="w-full rounded-2xl border px-3 py-2"
                  labelClassName="block text-sm font-medium mb-1"
                />
                <div>
                  <label className="block text-sm font-medium mb-1">Ride Type</label>
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
                <TextInput
                  label="Contact Phone"
                  value={phone}
                  onChange={setPhone}
                  placeholder="e.g., 04xx xxx xxx or +61 …"
                  error={errors.phone}
                  required
                  showErrors={showErrors}
                  className="w-full rounded-2xl border px-3 py-2"
                  labelClassName="block text-sm font-medium mb-1"
                />

                <TextInput
                  label="Promo Code"
                  value={promo}
                  onChange={setPromo}
                  placeholder="Try WELCOME10"
                  showErrors={showErrors}
                  className="w-full rounded-2xl border px-3 py-2"
                  labelClassName="block text-sm font-medium mb-1"
                />
              </div>

              {/* Notes */}
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

              {/* Fare Estimation */}
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
                    🚗 Driver ETA: ~{durationMin} minutes
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
                    disabled={submitting}
                    className="px-6 py-2 rounded-2xl bg-slate-900 text-white disabled:opacity-60 hover:bg-slate-800 transition-colors"
                  >
                    {submitting ? "Booking…" : "Book ride"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Summary */}
          <aside className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-6 h-fit flex flex-col gap-6">
            
            <div
              ref={mapRef}
              className="w-full h-64 rounded-2xl border border-slate-200"
            />
            
            <h2 className="text-lg font-semibold mb-3">Trip summary</h2>
            <ul className="text-sm space-y-2">
              <li><span className="text-slate-500">Pickup: </span><span className="font-medium">{pickup || "—"}</span></li>
              <li><span className="text-slate-500">Dropoff: </span><span className="font-medium">{dropoff || "—"}</span></li>
              <li><span className="text-slate-500">Distance: </span><span className="font-medium">{distanceKm ? `${distanceKm} km (demo)` : "—"}</span></li>
              <li><span className="text-slate-500">When: </span><span className="font-medium">{whenNow ? `Now (ETA ~${durationMin} min)` : `${date} ${time}`}</span></li>
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
              <h3 className="text-xl font-semibold">Booking confirmed</h3>
              <div className="mt-4 space-y-2 text-sm">
                {bookingRef && (
                  <div><span className="text-slate-500">Ref: </span><span className="font-mono font-medium">{bookingRef}</span></div>
                )}
                <div><span className="text-slate-500">Pickup: </span>{pickup}</div>
                <div><span className="text-slate-500">Dropoff: </span>{dropoff}</div>
                <div><span className="text-slate-500">When: </span>{whenNow ? `Now (ETA ~${durationMin} min)` : `${date} ${time}`}</div>
                <div><span className="text-slate-500">Fare est.: </span>${fare.toFixed(2)} AUD</div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-2xl border border-slate-300">Close</button>
              </div>
            </div>
          </div>
        )}

        <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} RideShare. Web-only localhost demo.</div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}

// function defaultDate() {
//   const d = new Date();
//   console.log(d);
//   d.setMinutes(d.getMinutes() + 10);
//   console.log(d.toISOString().split("T")[0])
//   return d.toISOString().split("T")[0];
// }

function currentDate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function currentTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
