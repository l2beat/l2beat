import React from 'react'

import { MoonIcon, SunIcon } from '../icons'

export function DarkThemeToggle() {
  return (
    <button
      id="dark-theme-toggle"
      className="block"
      title="Change color scheme"
    >
      <SunIcon className="hidden dark:block" aria-label="Toggle light mode" />
      <MoonIcon className="block dark:hidden" aria-label="Toggle dark mode" />
    </button>
  )
}
