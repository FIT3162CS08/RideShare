"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { usePathname } from 'next/navigation'

const img_url = "https://cdn-icons-png.flaticon.com/512/1571/1571921.png"

const Navigation = () => {
    const { user, logout } = useUser();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Home", icon: "🏠" },
        { href: "/booking", label: "Book Ride", icon: "🚗" },
        { href: "/trip", label: "My Trip", icon: "🗺️" },
        { href: "/driver_portal", label: "Drive", icon: "🚙" },
        { href: "/settings", label: "Settings", icon: "⚙️" },
    ];

    const isActive = (path: string) => pathname === path;

  return (
        <nav className="sticky top-0 z-50 glass-strong shadow-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2 rounded-2xl shadow-xl transform group-hover:scale-110 transition-transform">
                                <img src={img_url} className='h-8 w-8' alt="RideShare Logo"/>
                            </div>
                        </div>
                        <span className="text-2xl font-bold gradient-text-blue hidden md:block">RideShare</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden lg:flex items-center gap-2'>
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 rounded-xl font-medium transition-all group ${
                                    isActive(link.href)
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">{link.icon}</span>
                                    <span>{link.label}</span>
                                </span>
                                {!isActive(link.href) && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* User Actions */}
                    <div className='flex items-center gap-4'>
                        {user ? (
                            <div className='flex items-center gap-4'>
                                <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="font-medium text-gray-700">{user.name}</span>
                                </div>
                                <button 
                                    onClick={logout}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className='flex items-center gap-3'>
                                <Link 
                                    href="/login"
                                    className="px-6 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    href="/signup"
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 space-y-2 border-t border-gray-200 animate-fadeIn">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                                    isActive(link.href)
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                                        : 'text-gray-700 hover:bg-blue-50'
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.label}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
  )
}

export default Navigation
