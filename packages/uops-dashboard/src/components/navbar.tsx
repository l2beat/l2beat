'use client'

import { Navbar } from 'flowbite-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from './logo'

export function MainNavbar() {
  const currentPath = usePathname()
  return (
    <Navbar fluid rounded>
      <Navbar.Brand as={Link} href="https://l2beat.com">
        <Logo />
        <span className="ml-5 self-center whitespace-nowrap font-semibold text-xl dark:text-white">
          User Operations
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} href="/" active={currentPath === '/'}>
          Details
        </Navbar.Link>
        <Navbar.Link as={Link} href="/stats" active={currentPath === '/stats'}>
          Statistics
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
