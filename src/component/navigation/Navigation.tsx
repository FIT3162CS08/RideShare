import React from 'react'
import NavLink from './NavLink'

const img_url = "https://cdn-icons-png.flaticon.com/512/1571/1571921.png"

const Navigation = () => {
  return (
        <nav className="px-20 bg-gray-900 text-white flex gap-6 items-center justify-between h-20 font-mono">
            <div className='flex items-center justify-center gap-16'>
                <NavLink href="/">
                    <img src={img_url} className='h-15'/>
                </NavLink>
                <div className='flex gap-12'>
                    <NavLink href="/">△ Home</NavLink>
                    <NavLink href="/user">△ Users</NavLink>
                    <NavLink href="/about">△ About</NavLink>
                </div>
            </div>
            <div className='flex items-center gap-14'>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/about">Sign Up</NavLink>
            </div>
        </nav>
  )
}

export default Navigation
