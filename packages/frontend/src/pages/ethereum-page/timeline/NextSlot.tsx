import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'

/**
 * The slot being built: an outline at the end of the chain that fills as its
 * 12 seconds run out. The fill is one linear animation per slot, run by the
 * compositor, so the countdown costs no frames.
 */
export function NextSlotTile({
  column,
  nextSlotAt,
}: {
  column: number
  nextSlotAt: number | undefined
}) {
  const fillRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const seenSlot = useRef(false)

  useLayoutEffect(() => {
    const fill = fillRef.current
    if (!fill || nextSlotAt === undefined) return
    const left = Math.max(0, nextSlotAt - Date.now())
    // a slot that ticked over while watching starts empty; the first one is
    // joined part way through, guessed from a real-time 12 s slot
    const from = seenSlot.current ? 0 : Math.max(0, 1 - left / 12_000)
    seenSlot.current = true
    const animation = fill.animate(
      [{ transform: `scaleY(${from})` }, { transform: 'scaleY(1)' }],
      { duration: left, easing: 'linear', fill: 'forwards' },
    )
    return () => animation.cancel()
  }, [nextSlotAt])

  return (
    <div
      style={{ gridColumn: column + 1 }}
      className="relative h-(--tile-h) overflow-hidden rounded-[3px] border border-brand/60 border-dashed"
      aria-hidden
    >
      <div
        ref={fillRef}
        className={cn(
          'absolute inset-0 origin-bottom scale-y-0 bg-brand/20',
          reducedMotion && 'opacity-60',
        )}
      />
    </div>
  )
}

/** "Next slot in 7 s", written to the DOM a few times a second without rendering React */
export function Countdown({
  nextSlotAt,
  className,
}: {
  nextSlotAt: number | undefined
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || nextSlotAt === undefined) return
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((nextSlotAt - Date.now()) / 1000))
      writeText(
        element,
        seconds === 0 ? 'Next slot now' : `Next slot in ${seconds} s`,
      )
    }
    tick()
    const timer = setInterval(tick, 250)
    return () => clearInterval(timer)
  }, [nextSlotAt])
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      Next slot in 12 s
    </span>
  )
}
