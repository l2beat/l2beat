export function configureDarkMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('l2beat-theme')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const override: boolean | undefined = (window as any).__DARK_MODE__

  let darkModeEnabled = saved ? saved === 'dark' : prefersDark
  if (typeof override === 'boolean') {
    darkModeEnabled = override
  }

  updateTheme()

  function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled
    updateTheme(true)
  }

  function updateTheme(save?: boolean) {
    document.documentElement.classList.toggle('dark', darkModeEnabled)
    if (save) {
      localStorage.setItem('l2beat-theme', darkModeEnabled ? 'dark' : 'light')
    }
  }

  document
    .querySelector('.Navbar-Mode')
    ?.addEventListener('click', toggleDarkMode)
}
