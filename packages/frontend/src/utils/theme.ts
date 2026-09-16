import { useEffect } from 'react'

// The initial theme is applied by an inline script in index.html; keep both in sync.
const STORAGE_KEY = 'l2beat-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

type Theme = 'light' | 'dark'

export function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {}
  applyTheme(theme)
}

/** Follows OS theme changes and theme toggles made in other tabs. */
export function useThemeSync() {
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const sync = () => applyTheme(getPreferredTheme())
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
}

function getPreferredTheme(): Theme {
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
