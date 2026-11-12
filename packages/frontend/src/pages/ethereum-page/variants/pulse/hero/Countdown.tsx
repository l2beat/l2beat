import { useEffect, useRef } from 'react'
import { writeText } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { SlotClock } from '../useSlotClock'

const RING_RADIUS = 22
const RING = 2 * Math.PI * RING_RADIUS

/**
 * Seconds until the next slot, with a ring that empties as they pass.
 * Written to the DOM each frame, so the countdown never renders React.
 */
export function Countdown({
  clock,
  live,
  compact = false,
  className,
}: {
  clock: SlotClock
  live: boolean
  /** One line, for beside a label on a phone */
  compact?: boolean
  className?: string
}) {
  const ringRef = useRef<SVGCircleElement>(null)
  const secondsRef = useRef<HTMLSpanElement>(null)
  const unitRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!live) return
    let frame = requestAnimationFrame(function step() {
      const reading = clock.read(Date.now())
      if (reading && secondsRef.current && unitRef.current) {
        const left = reading.msLeft / reading.slotMs
        ringRef.current?.setAttribute(
          'stroke-dashoffset',
          String(RING * (1 - left)),
        )
        const due = reading.msLeft === 0
        writeText(
          secondsRef.current,
          due ? 'now' : String(Math.ceil(reading.msLeft / 1000)),
        )
        writeText(unitRef.current, due ? '' : 's')
      }
      frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [clock, live])

  const ring = (
    <svg
      viewBox="0 0 52 52"
      className={cn(
        '-rotate-90 shrink-0',
        compact ? 'size-5' : 'size-11 md:size-13',
      )}
      aria-hidden
    >
      <circle
        cx={26}
        cy={26}
        r={RING_RADIUS}
        className="fill-none stroke-surface-secondary"
        strokeWidth={compact ? 5 : 3}
      />
      <circle
        ref={ringRef}
        className="fill-none stroke-brand transition-none"
        cx={26}
        cy={26}
        r={RING_RADIUS}
        strokeWidth={compact ? 5 : 3}
        strokeLinecap="round"
        strokeDasharray={RING}
        strokeDashoffset={RING}
      />
    </svg>
  )
  const seconds = (
    <>
      <span ref={secondsRef}>{live ? '' : '—'}</span>
      <span
        ref={unitRef}
        className={cn('ml-0.5 text-secondary', !compact && 'text-[0.55em]')}
      />
    </>
  )

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-label-value-14 text-secondary tabular-nums',
          className,
        )}
      >
        {ring}
        <span>
          Next in <span className="font-medium text-primary">{seconds}</span>
        </span>
      </div>
    )
  }
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {ring}
      <div>
        <div className="text-label-value-14 text-secondary">Next block in</div>
        <div className="mt-1 font-light text-[28px] text-primary tabular-nums leading-none md:text-[32px]">
          {seconds}
        </div>
      </div>
    </div>
  )
}
