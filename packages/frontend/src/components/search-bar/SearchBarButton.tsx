import { useEffect, useRef } from 'react'
import { SearchIcon } from '~/icons/Search'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { useSearchBarContext } from './SearchBarContext'
import { SEARCH_BAR_EXAMPLES } from './searchBarExamples'

const EXAMPLE_INTERVAL_MS = 5000

export function SearchBarButton({ className }: { className?: string }) {
  const { setOpen } = useSearchBarContext()
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      // A fixed name: the hint after "Search" changes every few seconds.
      aria-label="Search"
      className={cn(
        'flex h-10 w-72 items-center rounded-lg border border-divider bg-surface-primary p-2.5 text-secondary transition-transform duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-[0.98]',
        className,
      )}
    >
      <SearchIcon className="size-5" />
      <span className="ml-2 flex min-w-0 items-baseline gap-1 font-medium text-sm">
        Search
        <ExampleHint />
      </span>
      <kbd className="ml-auto flex size-5 select-none items-center justify-center rounded border border-none bg-icon-secondary px-1.5 font-bold font-mono text-2xs text-primary-invert leading-none">
        /
      </kbd>
    </button>
  )
}

export function SmallSearchBarButton() {
  const { setOpen } = useSearchBarContext()
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      aria-label="Search"
      className="flex size-6 items-center justify-center transition-transform duration-150 ease-out active:scale-90"
    >
      <SearchIcon className="size-6" />
    </button>
  )
}

/**
 * One kind of thing search finds at a time, changing every few seconds; a
 * fixed hint for those who prefer reduced motion. Static on the server, so
 * the first render matches.
 *
 * The text is swapped outside React: a state update every few seconds would
 * be a React commit on every page, one that can land in the middle of a
 * gesture (the e2e perf ratchets count them).
 */
function ExampleHint() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    // Read on every tick: the preference can change while the page is open.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let index = 0
    const interval = setInterval(() => {
      if (reducedMotion.matches) return
      // Not under the pointer or keyboard focus, where it would change while
      // someone is about to click.
      if (element.closest('button')?.matches(':hover, :focus-visible')) return
      index = (index + 1) % SEARCH_BAR_EXAMPLES.length
      // The old hint leaves upwards and the next one rises in behind it, so
      // they read as one ticker; the blur hides the moment both are faint.
      const exit = element.animate(
        { opacity: 0, transform: 'translateY(-4px)', filter: 'blur(2px)' },
        // Held until the next hint takes over, or the old one flashes back.
        { duration: 120, easing: EASE_OUT_QUINT, fill: 'forwards' },
      )
      exit.onfinish = () => {
        element.textContent = SEARCH_BAR_EXAMPLES[index] ?? ''
        element.animate(
          [
            { opacity: 0, transform: 'translateY(4px)', filter: 'blur(2px)' },
            { opacity: 1, transform: 'none', filter: 'none' },
          ],
          { duration: 200, easing: EASE_OUT_QUINT },
        )
        exit.cancel()
      }
    }, EXAMPLE_INTERVAL_MS)
    return () => {
      clearInterval(interval)
      for (const animation of element.getAnimations()) animation.cancel()
    }
  }, [])

  return (
    <span ref={ref} className="truncate font-normal text-secondary/80">
      {SEARCH_BAR_EXAMPLES[0]}
    </span>
  )
}
