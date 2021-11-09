export function configureDarkMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('l2beat-theme')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const override: boolean | undefined = (window as any).__DARK_MODE__

  let darkModeEnabled = saved ? saved === 'dark' : prefersDark
  if (typeof override === 'boolean') {
    darkModeEnabled = override
    updateTheme()
  } else if (saved) {
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
    .querySelector('.Navbar-Mode')
    ?.addEventListener('click', toggleDarkMode)
}
