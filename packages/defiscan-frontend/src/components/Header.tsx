import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { SearchIcon } from './icons'
import { useSearchModal } from '../contexts/SearchModalContext'

export function Header() {
  const location = useLocation()
  const { openSearchModal } = useSearchModal()

  function navClass(path: string) {
    const active =
      path === '/gallery'
        ? location.pathname === '/gallery' ||
          location.pathname === '/protocols' ||
          location.pathname.startsWith('/protocol/')
        : location.pathname === path
    return clsx(
      'text-sm font-medium transition-colors tracking-[-0.35px]',
      active
        ? 'text-accent border-b-2 border-accent pb-0.5'
        : 'text-text-muted hover:text-accent',
    )
  }

  const isLandingPage = location.pathname === '/'

  return (
    <header className="bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/defiscan-logo-blue.svg"
              alt="DEFISCAN"
              className="h-7"
            />
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link to="/gallery" className={navClass('/gallery')}>
              Reports
            </Link>
            <Link to="/about" className={navClass('/about')}>
              About
            </Link>
          </nav>
        </div>

        {/* Desktop search trigger (hidden on landing page — it has its own hero search) */}
        {!isLandingPage && (
          <button
            type="button"
            onClick={() => openSearchModal()}
            className="relative hidden sm:flex items-center gap-2 pl-9 pr-4 py-1.5 w-40 md:w-64 rounded border border-border bg-hover text-sm text-text-muted/60 hover:border-accent/40 transition-colors cursor-text"
          >
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <span className="truncate">Search protocol or address...</span>
          </button>
        )}

        {/* Mobile search icon (hidden on landing page) */}
        {!isLandingPage && (
          <button
            type="button"
            onClick={() => openSearchModal()}
            className="sm:hidden p-2 -mr-1 text-text-muted hover:text-accent transition-colors"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  )
}
