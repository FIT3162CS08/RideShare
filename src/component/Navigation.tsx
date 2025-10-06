"use client";

import React from 'react'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'

const img_url = "https://cdn-icons-png.flaticon.com/512/1571/1571921.png"

const Navigation = () => {

    const { user, logout } = useUser();

  return (
        <nav className="px-20 bg-gray-900 text-white flex gap-6 items-center justify-between h-20 font-mono">
            <div className='flex items-center justify-center gap-16'>
                <Link href="/">
                    <img src={img_url} className='h-15'/>
                </Link>
                <div className='flex gap-12'>
                    <Link href="/">△ Home</Link>
                    <Link href="/booking">△ Book Ride</Link>
                    <Link href="/trip">△ My Trip</Link>
                    <Link href="/driver_portal">△ Drive</Link>
                    <Link href="/settings">△ Settings</Link>
                </div>
            </div>
            {user ? 
            (<div className='flex items-center gap-14'>
                <button onClick={logout}>Logout</button>
            </div>)
            :
            (<div className='flex items-center gap-14'>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
            </div>)
            }
        </nav>
  )
}

export default Navigation
