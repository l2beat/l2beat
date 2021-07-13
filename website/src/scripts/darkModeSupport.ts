export function darkModeSupport() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const saved = localStorage.getItem('l2beat-theme')

  let darkModeEnabled = (saved && saved === 'dark') || prefersDark
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.querySelector<HTMLElement>('.navbar__mode')!.style.display = 'block'

  const buttons = document.querySelectorAll<HTMLElement>('.navbar__mode button')
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i]
    button.addEventListener('click', toggleDarkMode)
  }
}
