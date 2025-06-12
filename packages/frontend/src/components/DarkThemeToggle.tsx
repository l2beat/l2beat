import { useTheme } from 'next-themes'
import { useRef } from 'react'
import { MoonIcon } from '~/icons/Moon'
import { SunIcon } from '~/icons/Sun'
import { cn } from '~/utils/cn'

export interface DarkThemeToggleProps {
  className?: string
}

export function DarkThemeToggle({ className }: DarkThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleThemeToggle = async () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    // Get the button position for the circular animation
    const button = buttonRef.current
    if (!button) {
      setTheme(newTheme)
      return
    }

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Set CSS custom properties for the animation origin BEFORE starting transition
    document.documentElement.style.setProperty('--circle-x', `${x}px`)
    document.documentElement.style.setProperty('--circle-y', `${y}px`)

    // Force a style recalculation to ensure properties are applied
    document.documentElement.offsetHeight

    // Start the view transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    // Clean up CSS properties after transition
    transition.finished.finally(() => {
      document.documentElement.style.removeProperty('--circle-x')
      document.documentElement.style.removeProperty('--circle-y')
    })
  }

  return (
    <button
      ref={buttonRef}
      className={cn('flex gap-4 font-medium', className)}
      title="Change color scheme"
      onClick={handleThemeToggle}
    >
      <SunIcon
        className="hidden text-xl dark:block"
        aria-label="Toggle light mode"
      />
      <MoonIcon
        className="block text-xl dark:hidden"
        aria-label="Toggle dark mode"
      />
    </button>
  )
}
