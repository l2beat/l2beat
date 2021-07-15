export function darkModeSupport() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('l2beat-theme')

  let darkModeEnabled = saved ? saved === 'dark' : prefersDark
  if (saved) {
    updateTheme()
  }

  function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled
    updateTheme()
  }

  function updateTheme() {
    const theme = darkModeEnabled ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    localStorage.setItem('l2beat-theme', theme)
  }

  document
    .querySelector('.navbar__mode')
    ?.addEventListener('click', toggleDarkMode)
}
