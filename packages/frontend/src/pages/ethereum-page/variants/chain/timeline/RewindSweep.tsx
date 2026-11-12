import { useLayoutEffect, useRef } from 'react'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { REWIND_MS } from '../state/rewind'
import { boundaryAfter } from './geometry'

/** Rewinding to the fork point, then playing forward again */
const BACK_MS = 520
const FORWARD_AT = 0.62

/**
 * The tape rewinding: a blue playhead runs back from the end of the chain to
 * the fork point, washing the slots it passes in scanlines, waits while the
 * orphan peels off and the replacement lands, then plays forward again.
 */
export function RewindSweep({ forkColumn }: { forkColumn: number }) {
  const washRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wash = washRef.current
    const head = headRef.current
    if (!wash || !head) return
    const width = wash.getBoundingClientRect().width
    const back = BACK_MS / REWIND_MS
    const options = { duration: REWIND_MS, fill: 'both' } as const
    wash.animate(
      [
        {
          clipPath: 'inset(0 0 0 100%)',
          opacity: 1,
          easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
        },
        {
          clipPath: 'inset(0 0 0 0)',
          opacity: 1,
          offset: back,
          easing: 'linear',
        },
        {
          clipPath: 'inset(0 0 0 0)',
          opacity: 1,
          offset: FORWARD_AT,
          easing: EASE_OUT_QUINT,
        },
        { clipPath: 'inset(0 0 0 100%)', opacity: 0.4 },
      ],
      options,
    )
    head.animate(
      [
        {
          transform: `translateX(${width}px)`,
          opacity: 0,
          easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
        },
        {
          transform: 'translateX(0)',
          opacity: 1,
          offset: back,
          easing: 'linear',
        },
        {
          transform: 'translateX(0)',
          opacity: 1,
          offset: FORWARD_AT,
          easing: EASE_OUT_QUINT,
        },
        { transform: `translateX(${width}px)`, opacity: 0 },
      ],
      options,
    )
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 z-20"
      style={{ left: boundaryAfter(forkColumn) }}
    >
      <div
        ref={washRef}
        className="absolute inset-0 rounded-md bg-[repeating-linear-gradient(0deg,color-mix(in_oklab,var(--chart-ethereum)_26%,transparent)_0_2px,transparent_2px_4px)] bg-chart-ethereum/10 backdrop-grayscale"
      />
      <div ref={headRef} className="absolute inset-y-0 left-0">
        <div className="-left-px absolute inset-y-0 w-0.5 bg-chart-ethereum shadow-[0_0_10px_2px_color-mix(in_oklab,var(--chart-ethereum)_60%,transparent)]" />
        <div className="-translate-x-full absolute top-0 flex items-center gap-1 whitespace-nowrap rounded-l-md bg-chart-ethereum py-0.5 pr-1.5 pl-1 font-bold text-[10px] text-white">
          <RewindGlyph className="size-2.5" />
          Rewind
        </div>
      </div>
    </div>
  )
}

export function RewindGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M8 3.5 1.5 8 8 12.5zM15 3.5 8.5 8l6.5 4.5z" />
    </svg>
  )
}
