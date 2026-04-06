import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { SearchIcon } from './icons'

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileInputRef.current?.focus()
    }
  }, [mobileSearchOpen])

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/protocols?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileSearchOpen(false)
    }
  }

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

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="relative hidden sm:block">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search protocol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-40 md:w-64 rounded border border-border bg-hover text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </form>

        {/* Mobile search icon */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen((v) => !v)}
          className="sm:hidden p-2 -mr-1 text-text-muted hover:text-accent transition-colors"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile search bar (expands below header) */}
      {mobileSearchOpen && (
        <form
          onSubmit={handleSearch}
          className="sm:hidden border-t border-border bg-white px-4 py-3"
        >
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search protocol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded border border-border bg-hover text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        </form>
      )}
    </header>
  )
}
