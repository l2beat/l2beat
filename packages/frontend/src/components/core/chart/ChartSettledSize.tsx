import { startTransition, useLayoutEffect, useRef, useState } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { cn } from '~/utils/cn'

// Recharts recomputes every series on every ResizeObserver tick, and that
// re-render was most of each frame while dragging the window edge. The chart
// keeps its last settled size and is stretched with a transform until the
// container stops moving, so it re-renders once per drag instead of per frame.
const SETTLE_MS = 150

type Size = { width: number; height: number }

export function ChartSettledSize({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [settled, setSettled] = useState<Size>()
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useResizeObserver({
    ref: outerRef,
    onResize: ({ width, height }) => {
      if (!width || !height) return
      const inner = innerRef.current
      if (!settled || !inner) {
        setSettled({ width, height })
        return
      }
      inner.style.transform = `scale(${width / settled.width}, ${height / settled.height})`
      clearTimeout(settleTimer.current)
      // The stretched chart is already right on screen, so the real
      // re-render can be time-sliced instead of blocking a frame.
      settleTimer.current = setTimeout(
        () => startTransition(() => setSettled({ width, height })),
        SETTLE_MS,
      )
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs after each settled commit to drop the interim stretch
  useLayoutEffect(() => {
    if (innerRef.current) innerRef.current.style.transform = ''
  }, [settled])

  useLayoutEffect(() => () => clearTimeout(settleTimer.current), [])

  return (
    <div ref={outerRef} className={className}>
      <div
        ref={innerRef}
        className={cn('origin-top-left', !settled && 'size-full')}
        style={settled}
      >
        {children}
      </div>
    </div>
  )
}
