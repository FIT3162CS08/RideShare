import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    Car,
    Users,
    Luggage,
    CreditCard,
    Star,
    User,
    MessageCircleMore,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function BookingCard({ booking }) {
    const [open, setOpen] = useState(false);

    // The person who requested the ride
    const passenger = booking.userId;

    // driver
    const { user } = useUser();

    async function onAccept() {
        if (!user) return;
        // Accept the ride
        await fetch(`/api/bookings/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                driverId: user.id,
                bookingId: booking._id,
            }), // current driver
        });
    }

    async function onRideStart() {
        if (!user) return;
        // Make the ride
        await fetch(`/api/bookings/ride_start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                driverId: user.id,
                bookingId: booking._id,
            }), // current driver
        });

        // Then refresh
    }

    console.log("BOOKING: ", booking);

    async function startConversation() {
        if (!user) return;
        // Make a conversation
        await fetch(`/api/messages/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                passenger: booking.userId._id,
                driver: user.id,
                pickup: booking.pickup,
                dropoff: booking.dropoff,
                date: booking.date,
            }), // current driver
        });

        // Open message window
    }

    return (
        <div className="border rounded-3xl p-5 shadow-sm bg-white hover:shadow-md mb-4 transition-all">
            {/* Header */}
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div>
                    <div className="font-semibold text-lg text-gray-800">
                        {booking.pickup}
                    </div>
                    <div className="text-gray-500 text-sm">
                        → {booking.dropoff}
                    </div>
                    <div className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {booking.date} •{" "}
                        {booking.time}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "waiting"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {booking.status}
                    </div>
                    {open ? (
                        <ChevronUp className="w-6 h-6 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                    )}
                </div>
            </div>

            {/* Collapsible Content */}
            <div
                className={`overflow-hidden transition-all ${
                    open ? "max-h-[500px] mt-4" : "max-h-0"
                }`}
            >
                <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" /> <span>Ride type:</span>{" "}
                        <b>{booking.rideType}</b>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" /> <span>Passengers:</span>{" "}
                        <b>{booking.passengers}</b>
                    </div>
                    <div className="flex items-center gap-2">
                        <Luggage className="w-4 h-4" /> <span>Luggage:</span>{" "}
                        <b>{booking.luggage}</b>
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> <span>Payment:</span>{" "}
                        <b>{booking.payment}</b>
                    </div>
                    <div>
                        <span className="text-gray-500">Fare:</span>{" "}
                        <b>${booking.fareEstimate}</b>
                    </div>

                    {/* User Info */}
                    {passenger && (
                        <div className="border-t pt-3 mt-3">
                            <div className="flex items-center gap-2 text-gray-800">
                                <User className="w-4 h-4" />
                                <span className="font-medium">
                                    {passenger.name}
                                </span>
                                <MessageCircleMore
                                    onClick={() => startConversation()}
                                    className="w-4 h-4 hover:cursor-pointer transition-all duration-75 hover:scale-105"
                                />
                            </div>
                            <div className="flex items-center gap-1 text-yellow-600 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400" />
                                <span>
                                    {passenger.ratingCount == 0
                                        ? "N/A"
                                        : passenger.rating?.toFixed(1) || "N/A"}
                                </span>
                                <span className="text-gray-500 text-xs ml-1">
                                    ({passenger.ratingCount || 0} reviews)
                                </span>
                            </div>
                        </div>
                    )}

                    {booking.notes && (
                        <div>
                            <span className="text-gray-500">Notes:</span>{" "}
                            {booking.notes}
                        </div>
                    )}
                </div>

                {/* Accept Ride Button */}
                {booking.status === "requested" ? (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={onAccept}
                            className="px-5 py-2.5 rounded-2xl bg-green-600 text-white text-lg hover:bg-green-700 transition-colors"
                        >
                            Accept Ride
                        </button>
                    </div>
                ) : booking.status === "waiting" ? (
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={onRideStart}
                            className="px-5 py-2.5 rounded-2xl bg-green-600 text-white text-lg hover:bg-green-700 transition-colors"
                        >
                            Passenger in Car
                        </button>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
