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
// A drag fires resize events every frame; remeasuring waits for the last one.
const RESIZE_SETTLE_MS = 200

/**
 * Keeps the server-rendered markup in place and mounts the React tree only
 * once the wrapper approaches the viewport. Until then React hydrates an
 * element with no children and leaves the existing innerHTML alone, so
 * below-the-fold sections cost nothing on the hydration task.
 *
 * The same wrapper lets the browser skip style and layout of the contents
 * while they are off screen (`content-visibility: auto`), which is most of
 * what a long page pays on every resize step and scroll. The class goes on
 * after the first paint, and by hand rather than through a render: the
 * browser has then remembered each wrapper's real height so fragment
 * navigation on load lands where it did, and re-rendering this wrapper
 * before it hydrates would wipe the server markup.
 *
 * Not a Suspense boundary on purpose: React client-renders a boundary it has
 * not hydrated yet as soon as any context above it changes, and next-themes
 * does that right after mount. That would drop the server markup or force
 * every section to hydrate at once.
 */
export function LazyHydrate({ children, eager = false, className }: Props) {
  const [nearViewportRef, isNear] = useIsNearViewport()
  const isServer = typeof window === 'undefined'
  // Layout containment from the start, as `content-visibility` implies it
  // later: it stops the section's top margin collapsing through the wrapper,
  // so the remembered height already includes that margin.
  const wrapperClassName = cn(
    className,
    '[contain-intrinsic-size:auto_800px] [contain:layout]',
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
      dangerouslySetInnerHTML={{ __html: '' }}
    />
  )
}

const skippingWrappers = new Set<HTMLElement>()
let resizeSettleTimer: ReturnType<typeof setTimeout> | undefined
let cancelRemeasure = () => {}

function skipWhileOffscreen(element: HTMLElement) {
  if (skippingWrappers.size === 0) {
    window.addEventListener('resize', remeasureWhenResizeSettles)
  }
  skippingWrappers.add(element)
  const cancel = afterFirstPaint(() =>
    element.classList.add(SKIP_WHILE_OFFSCREEN),
  )
  return () => {
    cancel()
    skippingWrappers.delete(element)
    if (skippingWrappers.size === 0) {
      window.removeEventListener('resize', remeasureWhenResizeSettles)
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
  cancelRemeasure()
  for (const element of skippingWrappers) {
    element.classList.remove(SKIP_WHILE_OFFSCREEN)
  }
  cancelRemeasure = afterFirstPaint(() => {
    for (const element of skippingWrappers) {
      element.classList.add(SKIP_WHILE_OFFSCREEN)
    }
  })
}

// Two frames: the first callback runs before the pending frame paints.
function afterFirstPaint(callback: () => void) {
  let inner: number | undefined
  const outer = requestAnimationFrame(() => {
    inner = requestAnimationFrame(callback)
  })
  return () => {
    cancelAnimationFrame(outer)
    if (inner !== undefined) cancelAnimationFrame(inner)
  }
}
