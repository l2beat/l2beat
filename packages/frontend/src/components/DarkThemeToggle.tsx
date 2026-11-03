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
      withoutTransitions(() => flushSync(() => setTheme(newTheme)))
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
    // Tells globals.css this is the circle reveal, not a page load.
    document.documentElement.dataset.themeTransition = ''

    // flushSync required: View Transitions API needs synchronous DOM updates,
    // but setTheme() triggers async React state updates
    document
      .startViewTransition(() => {
        withoutTransitions(() => flushSync(() => setTheme(newTheme)))
      })
      .finished.finally(() => {
        style.removeProperty('--circle-x')
        style.removeProperty('--circle-y')
        style.removeProperty('--circle-radius')
        delete document.documentElement.dataset.themeTransition
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

/**
 * Swaps the theme without every colour transition on the page animating to
 * the new palette. `flushSync` makes next-themes' effect apply the class
 * before the rule is gone.
 *
 * next-themes' own `disableTransitionOnChange` does the same, but also on
 * every page load, where it costs two restyles of the whole document while
 * the page hydrates.
 */
function withoutTransitions(change: () => void) {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important}'
  document.head.appendChild(style)
  change()
  // Restyles now, while the rule still applies.
  getComputedStyle(document.body).opacity
  setTimeout(() => style.remove(), 1)
}
