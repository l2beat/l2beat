import { useLayoutEffect, useRef } from 'react'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { rewindTiming } from '../state/rewind'
import { boundaryAfter } from './geometry'

const EASE_IN = 'cubic-bezier(0.5, 0, 0.75, 0)'
/** How long the playhead takes to run forward to the head again */
const FORWARD_MS = 700

/**
 * The tape rewinding: a blue playhead runs back from the end of the chain to
 * the fork point, washing every rewritten slot in scanlines, waits while the
 * orphaned branch peels off and the winning blocks land, then plays forward.
 */
export function RewindSweep({
  forkColumn,
  depth,
}: {
  forkColumn: number
  depth: number
}) {
  const washRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: one replay per mount, keyed by the reorg
  useLayoutEffect(() => {
    const wash = washRef.current
    const head = headRef.current
    if (!wash || !head) return
    const timing = rewindTiming(depth)
    const at = (ms: number) => Math.min(1, ms / timing.total)
    const width = wash.getBoundingClientRect().width
    const sweep = (el: HTMLElement, out: Keyframe, home: Keyframe) =>
      el.animate(
        [
          { ...out, offset: 0 },
          { ...out, offset: at(timing.rewindStart), easing: EASE_IN },
          { ...home, offset: at(timing.rewindEnd) },
          { ...home, offset: at(timing.forward), easing: EASE_OUT_QUINT },
          { ...out, offset: at(timing.forward + FORWARD_MS) },
          { ...out, offset: 1 },
        ],
        { duration: timing.total, fill: 'both' },
      )
    sweep(
      wash,
      { clipPath: 'inset(0 0 0 100%)' },
      { clipPath: 'inset(0 0 0 0)' },
    )
    sweep(
      head,
      { transform: `translateX(${width}px)`, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
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
        className="absolute inset-0 rounded-md bg-[repeating-linear-gradient(0deg,color-mix(in_oklab,var(--chart-ethereum)_26%,transparent)_0_2px,transparent_2px_4px)] bg-chart-ethereum/10"
      />
      <div ref={headRef} className="absolute inset-y-0 left-0">
        <div className="-left-px absolute inset-y-0 w-0.5 bg-chart-ethereum shadow-[0_0_10px_2px_color-mix(in_oklab,var(--chart-ethereum)_60%,transparent)]" />
        <div className="-translate-x-full absolute top-0 flex items-center gap-1 whitespace-nowrap rounded-l-md bg-chart-ethereum py-0.5 pr-1.5 pl-1 font-bold text-[10px] text-white">
          <RewindGlyph className="size-2.5" />
          Fork point
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
