'use client'

import { useTheme } from 'next-themes'
import MoonIcon from '~/icons/moon.svg'
import SunIcon from '~/icons/sun.svg'

export interface DarkThemeToggleProps {
  withText?: boolean
}

export function DarkThemeToggle({ withText }: DarkThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  return (
    <button
      className="flex gap-4 font-medium"
      title="Change color scheme"
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}
    >
      <SunIcon
        className="hidden dark:block text-xl"
        aria-label="Toggle light mode"
      />
      <MoonIcon
        className="block dark:hidden text-xl"
        aria-label="Toggle dark mode"
      />
      {withText && (
        <>
          <span className="inline dark:hidden">Switch to dark theme</span>
          <span className="hidden dark:inline">Switch to light theme</span>
        </>
      )}
    </button>
  )
}
