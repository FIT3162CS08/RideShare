import Link from 'next/link'
import React from 'react'

const NavLink = ({children, href}: {children: any, href:string}) => {
  return (
    <Link href={href}>{children}</Link>
  )
}

export default NavLink
