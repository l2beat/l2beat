import { useTheme } from 'next-themes'
import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { MoonIcon } from '~/icons/Moon'
import { SunIcon } from '~/icons/Sun'
import { cn } from '~/utils/cn'

interface DarkThemeToggleProps {
  className?: string
}

export function DarkThemeToggle({ className }: DarkThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    const button = buttonRef.current

    const prefersReducedMotion = matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // fallback if View Transitions API not supported, button not available, or reduced motion preferred
    if (!document.startViewTransition || !button || prefersReducedMotion) {
      setTheme(newTheme)
      return
    }

    // calculate circle animation origin (button center)
    const { left, top, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2

    // radius needs to reach the farthest corner of the viewport
    const maxX = Math.max(x, innerWidth - x)
    const maxY = Math.max(y, innerHeight - y)
    const radius = Math.hypot(maxX, maxY)

    // set CSS custom properties for the animation
    const style = document.documentElement.style
    style.setProperty('--circle-x', `${x}px`)
    style.setProperty('--circle-y', `${y}px`)
    style.setProperty('--circle-radius', `${radius}px`)

    // flushSync required: View Transitions API needs synchronous DOM updates,
    // but setTheme() triggers async React state updates
    document
      .startViewTransition(() => {
        flushSync(() => setTheme(newTheme))
      })
      .finished.finally(() => {
        style.removeProperty('--circle-x')
        style.removeProperty('--circle-y')
        style.removeProperty('--circle-radius')
      })
  }

  return (
    <button
      ref={buttonRef}
      className={cn('flex gap-4 font-medium', className)}
      title="Change color scheme"
      onClick={toggleTheme}
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
