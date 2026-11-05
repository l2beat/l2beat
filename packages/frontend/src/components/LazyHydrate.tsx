import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { useIsNearViewport } from '~/hooks/useIsNearViewport'
import { cn } from '~/utils/cn'

interface Props {
  children: ReactNode
  /** Hydrate immediately, for content that must run effects on load. */
  eager?: boolean
  className?: string
}

const SKIP_WHILE_OFFSCREEN = '[content-visibility:auto]'
// `content-visibility: auto` contains the wrapper's paint and layout even
// while it is on screen: it clips whatever overflows the wrapper (a tooltip,
// a popover, a highlighted card's glow), traps their z-index below the next
// section, and moves the wrapper's text by a subpixel whenever it turns on
// or off. So a wrapper skips only while it is this far off screen, where
// none of that shows.
const OFFSCREEN_MARGIN = '100% 0px'
// A drag fires resize events every frame; remeasuring waits for the last one.
const RESIZE_SETTLE_MS = 200
// React 19 compares props by identity and sets innerHTML whenever this object
// changes, so a fresh one per render would wipe the server markup on any
// re-render before the section mounts.
const KEEP_SERVER_MARKUP = { __html: '' }

/**
 * Keeps the server-rendered markup in place and mounts the React tree only
 * once the wrapper approaches the viewport. Until then React hydrates an
 * element with no children and leaves the existing innerHTML alone, so
 * below-the-fold sections cost nothing on the hydration task.
 *
 * The same wrapper lets the browser skip style and layout of the contents
 * while they are off screen (`content-visibility: auto`), which is most of
 * what a long page pays on every resize step and scroll. Only wrappers more
 * than a viewport away skip, and only once the browser has laid them out and
 * remembered their real height, so fragment navigation on load lands where
 * it did.
 *
 * Not a Suspense boundary on purpose: React client-renders a boundary it has
 * not hydrated yet as soon as any context above it changes, and next-themes
 * does that right after mount. That would drop the server markup or force
 * every section to hydrate at once.
 */
export function LazyHydrate({ children, eager = false, className }: Props) {
  const [nearViewportRef, isNear] = useIsNearViewport()
  const isServer = typeof window === 'undefined'
  // Its own block formatting context whether it skips or not, so the
  // section's margins never collapse through it and its height stays the
  // same when skipping starts or stops.
  const wrapperClassName = cn(
    className,
    'flow-root [contain-intrinsic-size:auto_800px]',
  )

  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      const stopObserving = nearViewportRef(element)
      if (!element) return stopObserving
      const stopSkipping = skipWhileOffscreen(element)
      return () => {
        stopObserving?.()
        stopSkipping()
      }
    },
    [nearViewportRef],
  )

  if (isServer || eager || isNear) {
    return (
      <div ref={ref} className={wrapperClassName}>
        {children}
      </div>
    )
  }
  return (
    <div
      ref={ref}
      className={wrapperClassName}
      suppressHydrationWarning
      dangerouslySetInnerHTML={KEEP_SERVER_MARKUP}
    />
  )
}

const wrappers = new Set<HTMLElement>()
let offscreenObserver: IntersectionObserver | undefined
let resizeSettleTimer: ReturnType<typeof setTimeout> | undefined

// An observer first reports an element after the browser lays out the next
// frame, which also records each wrapper's height, so a wrapper never skips
// without its real height. Observing it again repeats that after a resize.
function skipWhileOffscreen(element: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  offscreenObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle(
          SKIP_WHILE_OFFSCREEN,
          !entry.isIntersecting,
        )
      }
    },
    { rootMargin: OFFSCREEN_MARGIN },
  )
  if (wrappers.size === 0) {
    window.addEventListener('resize', remeasureWhenResizeSettles)
  }
  wrappers.add(element)
  offscreenObserver.observe(element)
  return () => {
    offscreenObserver?.unobserve(element)
    element.classList.remove(SKIP_WHILE_OFFSCREEN)
    wrappers.delete(element)
    if (wrappers.size === 0) {
      window.removeEventListener('resize', remeasureWhenResizeSettles)
      clearTimeout(resizeSettleTimer)
    }
  }
}

// A skipped section keeps the height it had at the viewport it was last laid
// out in (below `md`, charts are sized in vh), so after any resize every
// wrapper is laid out once more before it may skip again; otherwise a jump
// to a deep section lands off by the reflow of everything above it.
function remeasureWhenResizeSettles() {
  clearTimeout(resizeSettleTimer)
  resizeSettleTimer = setTimeout(remeasureAll, RESIZE_SETTLE_MS)
}

function remeasureAll() {
  for (const element of wrappers) {
    element.classList.remove(SKIP_WHILE_OFFSCREEN)
    offscreenObserver?.unobserve(element)
    offscreenObserver?.observe(element)
  }
}
