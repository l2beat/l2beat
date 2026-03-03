import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

export function Header() {
  const location = useLocation()

  function navClass(path: string) {
    const active = path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)
    return clsx(
      'transition-colors',
      active
        ? 'text-purple-600 font-semibold'
        : 'text-text-secondary hover:text-purple-600',
    )
  }

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-purple-600">DeFiScan</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={navClass('/')}>
            Reviews
          </Link>
          <Link to="/compare" className={navClass('/compare')}>
            Compare
          </Link>
          <a
            href="https://deficollective.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-purple-600 transition-colors"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  )
}
