/**
 * The light or dark theme lives on `<html>` as a class (`dark:` variants key
 * off it) and nowhere else: no React state or context. An inline script at
 * the start of `<body>` (see index.html) sets it before anything paints, and
 * later changes write it only when it differs.
 *
 * A theme provider in the React tree (like next-themes) re-applies the
 * theme in a mount effect and changes its context right after hydration.
 * With transitions disabled, each apply adds and removes a stylesheet: two
 * restyles of the whole document on every page load.
 */
export type Theme = 'light' | 'dark'

/** What the visitor picked; nothing stored means following the system. */
type ThemePreference = Theme | 'system'

const STORAGE_KEY = 'l2beat-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Inline in the page template. ES5 and self-contained: it runs before any bundle. */
export const themeScript = `(function(){var p;try{p=localStorage.getItem(${JSON.stringify(STORAGE_KEY)})}catch(e){}var t=p==="light"||p==="dark"?p:matchMedia(${JSON.stringify(DARK_QUERY)}).matches?"dark":"light",d=document.documentElement;d.classList.add(t);d.style.colorScheme=t})()`

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {}
  applyTheme(theme)
}

/**
 * Follows the system theme while the visitor has not picked one, and a pick
 * made in another tab.
 */
export function watchThemeChanges() {
  const system = matchMedia(DARK_QUERY)
  system.addEventListener('change', () => {
    if (readPreference() === 'system') applyTheme(resolve('system'))
  })
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) applyTheme(resolve(readPreference()))
  })
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (root.classList.contains(theme)) return
  withoutTransitions(() => {
    root.classList.remove(theme === 'dark' ? 'light' : 'dark')
    root.classList.add(theme)
    root.style.colorScheme = theme
  })
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return 'system'
}

function resolve(preference: ThemePreference): Theme {
  if (preference !== 'system') return preference
  return matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Swaps the palette at once, rather than every colour transition on the
 * page animating to it.
 */
function withoutTransitions(change: () => void) {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important}'
  document.head.appendChild(style)
  change()
  // Restyles now, while the rule still applies.
  getComputedStyle(document.body).opacity
  setTimeout(() => style.remove(), 1)
}
