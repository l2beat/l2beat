// IMPORTNAT NOTE: If you change something here, please visit configureDarkThemeToggle in packages/frontend/src/scripts/configureDarkThemeToggle.ts
// and make sure that it is consistent with this function.

export function initializeTheme() {
  let prefersDark: boolean | undefined
  const saved = localStorage.getItem('l2beat-theme')

  if (document.documentElement.classList.contains('light')) {
    prefersDark = false
  } else if (document.documentElement.classList.contains('dark')) {
    prefersDark = true
  } else if (saved === 'dark') {
    prefersDark = true
  } else if (saved === 'light') {
    prefersDark = false
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    prefersDark = true
  }

  if (prefersDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
