import { Navbar } from 'flowbite-react'
import { Logo } from './Logo'

export function MainNavbar() {
  const currentPath = window.location.pathname
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://l2beat.com">
        <Logo />
        <span className="ml-5 self-center whitespace-nowrap font-semibold text-xl dark:text-white">
          User Operations
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" active={currentPath === '/'}>
          Details
        </Navbar.Link>
        <Navbar.Link href="/stats" active={currentPath === '/stats'}>
          Statistics
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
