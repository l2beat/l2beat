import { LocalStorage } from './local-storage/LocalStorage'

// IMPORTNAT NOTE: If you change something here, please visit initializeTheme in packages/frontend/src/scripts/initializeTheme.ts
// and make sure that it is consistent with this function.

// Part of updateTheme function is to disable transition to prevent weird animation on switching theme
// https://paco.me/writing/disable-theme-transitions

export function configureThemeToggle() {
  function toggleDarkMode(toggleElement: Element) {
    const isLight = getCurrentTheme() === 'light'
    updateTheme(isLight)
    LocalStorage.setItem('theme', isLight ? 'dark' : 'light')
    toggleElement.dispatchEvent(new Event('change'))
  }

  function updateTheme(isLight: boolean) {
    const css = document.createElement('style')
    css.type = 'text/css'
    css.appendChild(
      document.createTextNode(
        `* {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
       }`,
      ),
    )
    document.head.appendChild(css)

    if (isLight) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    const _ = window.getComputedStyle(css).opacity
    document.head.removeChild(css)
  }

  document
    .querySelectorAll('[data-role="dark-theme-toggle"]')
    .forEach((e) => e.addEventListener('click', () => toggleDarkMode(e)))
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
