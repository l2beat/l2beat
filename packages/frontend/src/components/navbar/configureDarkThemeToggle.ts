const callbacks: ((isDarkMode: boolean) => void)[] = []

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
    for (const callback of callbacks) {
      callback(isDark)
    }
  }

  function updateTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
  }

  document
    .querySelectorAll('[data-role="dark-theme-toggle"]')
    .forEach((e) => e.addEventListener('click', toggleDarkMode))
}

// NOTE(radomski): If you need to do something while the website changes the
// theme you might hook into this callback to get notified when this happens.
// Currently this is use to re-render the chart using new style for Y axis
// lines.
export function useThemeToggle(callback: (isDarkMode: boolean) => void) {
  callbacks.push(callback)
}

export function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark')
}
