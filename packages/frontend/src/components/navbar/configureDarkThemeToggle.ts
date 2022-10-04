export function configureDarkThemeToggle() {
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

  updateTheme(prefersDark ?? false)

  function toggleDarkMode() {
    const isDark = !document.documentElement.classList.contains('dark')
    updateTheme(isDark)
    localStorage.setItem('l2beat-theme', isDark ? 'dark' : 'light')
  }

  function updateTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }

  document
    .querySelectorAll('[data-role="dark-theme-toggle"]')
    .forEach((e) => e.addEventListener('click', toggleDarkMode))
}
