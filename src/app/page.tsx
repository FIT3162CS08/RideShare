import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Welcome to RideShare
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your reliable rideshare solution for Monash University
                    </p>
                </div>

                {/* Main Options Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Find a Ride */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Find a Ride</h3>
                        <p className="text-gray-600 mb-6">
                            Book a ride to or from Monash University campuses with our reliable drivers.
                        </p>
                        <Link 
                            href="/booking"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                        >
                            Book Now
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Vehicle Options */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Vehicle Options</h3>
                        <p className="text-gray-600 mb-6">
                            Choose from Standard, XL, or Premium vehicles to match your needs and budget.
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>Standard</span>
                                <span>4 seats</span>
                            </div>
                            <div className="flex justify-between">
                                <span>XL</span>
                                <span>6 seats</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Premium</span>
                                <span>Luxury</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Payment Methods</h3>
                        <p className="text-gray-600 mb-6">
                            Pay securely with your card or choose cash payment for flexibility.
                        </p>
                        <div className="flex space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">💳</span>
                            </div>
                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-green-600">💰</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver Portal Option */}
                <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Drive with RideShare</h3>
                    <p className="text-gray-600 mb-6">
                        Join our driver community and start earning by providing rides to students and staff.
                    </p>
                    <Link 
                        href="/driver_portal"
                        className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-colors"
                    >
                        Driver Portal
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}
