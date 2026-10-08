import { useState } from 'react'
import { Logo } from './Logo'

export function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const currentPath = window.location.pathname
  return (
    <nav className="rounded bg-gray-800 px-2 py-2.5 sm:px-4">
      <div className="mx-auto flex flex-wrap items-center justify-between">
        <a className="flex items-center" href="https://l2beat.com">
          <Logo />
          <span className="ml-5 self-center whitespace-nowrap font-semibold text-white text-xl">
            User Operations
          </span>
        </a>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
          className="inline-flex items-center rounded-lg p-2 text-gray-400 text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden"
        >
          <span className="sr-only">Main menu</span>
          <svg
            aria-hidden="true"
            className="h-6 w-6 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 5h18v2.5H3zm0 5.75h18v2.5H3zM3 16.5h18V19H3z" />
          </svg>
        </button>
        <div
          id="navbar-menu"
          className={`w-full md:block md:w-auto ${isOpen ? '' : 'hidden'}`}
        >
          <ul className="mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:font-medium md:text-sm">
            <NavbarLink href="/" currentPath={currentPath}>
              Details
            </NavbarLink>
            <NavbarLink href="/stats" currentPath={currentPath}>
              Statistics
            </NavbarLink>
          </ul>
        </div>
      </div>
    </nav>
  )
}

function NavbarLink({
  href,
  currentPath,
  children,
}: {
  href: string
  currentPath: string
  children: React.ReactNode
}) {
  const className =
    href === currentPath
      ? 'text-white'
      : 'border-gray-700 border-b text-gray-400 hover:bg-gray-700 hover:text-white md:border-0 md:hover:bg-transparent'
  return (
    <li>
      <a href={href} className={`block py-2 pr-4 pl-3 md:p-0 ${className}`}>
        {children}
      </a>
    </li>
  )
}
