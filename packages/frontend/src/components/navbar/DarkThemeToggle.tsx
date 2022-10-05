import React from 'react'

import { MoonIcon, SunIcon } from '../icons'

export interface DarkThemeToggleProps {
  withText?: boolean
}

export function DarkThemeToggle({ withText }: DarkThemeToggleProps) {
  return (
    <button
      data-role="dark-theme-toggle"
      className="flex gap-4 font-medium"
      title="Change color scheme"
    >
      <SunIcon className="hidden dark:block" aria-label="Toggle light mode" />
      <MoonIcon className="block dark:hidden" aria-label="Toggle dark mode" />
      {withText && (
        <>
          <span className="inline dark:hidden">Switch to dark theme</span>
          <span className="hidden dark:inline">Switch to light theme</span>
        </>
      )}
    </button>
  )
}
