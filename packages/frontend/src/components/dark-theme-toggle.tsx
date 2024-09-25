'use client'

import { useTheme } from 'next-themes'
import { MoonIcon } from '~/icons/moon'
import { SunIcon } from '~/icons/sun'

export interface DarkThemeToggleProps {
  withText?: boolean
}

export function DarkThemeToggle({ withText }: DarkThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button
      className="flex gap-4 font-medium"
      title="Change color scheme"
      onClick={() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      }}
    >
      <SunIcon
        className="hidden text-xl dark:block"
        aria-label="Toggle light mode"
      />
      <MoonIcon
        className="block text-xl dark:hidden"
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
