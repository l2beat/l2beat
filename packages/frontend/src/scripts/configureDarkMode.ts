export function configureDarkMode() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('l2beat-theme')
  const override: boolean | undefined = (window as { __DARK_MODE__?: boolean })
    .__DARK_MODE__

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
