import { useEffect, useState } from 'react'
import { useInterval } from '~/hooks/useInterval'
import { SearchIcon } from '~/icons/Search'
import { cn } from '~/utils/cn'
import { useSearchBarContext } from './SearchBarContext'
import { SEARCH_BAR_EXAMPLES } from './searchBarExamples'

const EXAMPLE_INTERVAL_MS = 2800

export function SearchBarButton({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  const { setOpen } = useSearchBarContext()
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className={cn(
        'flex h-10 w-72 items-center rounded-lg border border-divider bg-surface-primary p-2.5 text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        className,
      )}
    >
      <SearchIcon className="size-5" />
      <span className="ml-2 flex min-w-0 items-baseline gap-1 font-medium text-sm">
        {label ?? (
          <>
            Search
            <ExampleHint />
          </>
        )}
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
      className="flex size-6 items-center justify-center"
    >
      <SearchIcon className="size-6" />
    </button>
  )
}

/**
 * One kind of thing search finds at a time, changing every few seconds; a
 * fixed hint for those who prefer reduced motion. Static on the server, so
 * the first render matches.
 */
function ExampleHint() {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  useInterval(
    () => setIndex((i) => (i + 1) % SEARCH_BAR_EXAMPLES.length),
    animate ? EXAMPLE_INTERVAL_MS : null,
  )

  return (
    <span
      key={index}
      className="fade-in slide-in-from-bottom-1 animate-in truncate font-normal text-secondary/80 duration-300"
    >
      {SEARCH_BAR_EXAMPLES[index]?.hint}
    </span>
  )
}
