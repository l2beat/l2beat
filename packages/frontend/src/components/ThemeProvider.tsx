import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

// The initial theme is applied before first paint by an inline script in
// index.html; keep both in sync.
const STORAGE_KEY = 'l2beat-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  /** Undefined during SSR, where the theme is not known yet. */
  theme: Theme | undefined
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read from the DOM so the first client render already matches the theme
  // applied by index.html and the context does not change right after mount.
  const [theme, setThemeState] = useState(readAppliedTheme)

  const setTheme = useCallback((theme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
    // Applied synchronously so callers like startViewTransition see the change.
    applyTheme(theme)
    setThemeState(theme)
  }, [])

  // Follow OS theme changes and theme toggles made in other tabs.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const sync = () => {
      const preferred = readPreferredTheme()
      applyTheme(preferred)
      setThemeState(preferred)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) sync()
    }

    media.addEventListener('change', sync)
    window.addEventListener('storage', onStorage)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function readAppliedTheme(): Theme | undefined {
  if (typeof document === 'undefined') return undefined
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function readPreferredTheme(): Theme {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {}
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  withoutTransitions(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    root.style.colorScheme = theme
  })
}

/** Swaps colors in one step instead of animating every transitioned element. */
function withoutTransitions(update: () => void) {
  const style = document.createElement('style')
  style.textContent = '*{transition:none!important}'
  document.head.appendChild(style)
  update()
  // Forces a style recalc so the new colors land while transitions are off.
  window.getComputedStyle(document.body)
  setTimeout(() => style.remove(), 1)
}
