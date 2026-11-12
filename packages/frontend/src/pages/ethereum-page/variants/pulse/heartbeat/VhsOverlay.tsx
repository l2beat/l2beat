import { useLayoutEffect, useRef } from 'react'
import type { Reorg } from '../../../live/types'
import { formatInteger } from '../format'
import { type RewindPlan, reorgRange } from '../useRewind'

/**
 * A tape deck's on-screen display over the trace while it rewinds: the
 * mode in the corner, scanlines, and a tracking band rolling down. Opacity
 * and transform only, so it costs the compositor and not the page.
 */
export function VhsOverlay({
  reorg,
  plan,
}: {
  reorg: Reorg
  plan: RewindPlan
}) {
  const scanRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const rewindRef = useRef<HTMLSpanElement>(null)
  const oldRef = useRef<HTMLSpanElement>(null)
  const redrawRef = useRef<HTMLSpanElement>(null)
  const playRef = useRef<HTMLSpanElement>(null)
  const { first, last } = reorgRange(reorg)
  const slots =
    first === last
      ? `SLOT ${formatInteger(first)}`
      : `SLOTS ${formatInteger(first)}–${formatInteger(last)}`

  // biome-ignore lint/correctness/useExhaustiveDependencies: plays once per reorg, keyed by it
  useLayoutEffect(() => {
    const at = (ms: number) => Math.min(1, ms / plan.total)
    const options = { duration: plan.total, fill: 'forwards' as const }
    const shownBetween = (fromMs: number, toMs: number) => {
      const from = at(fromMs)
      const to = at(toMs)
      return [
        { opacity: 0 },
        { opacity: 0, offset: from },
        { opacity: 1, offset: Math.min(to, from + 0.015) },
        { opacity: 1, offset: Math.max(from, to - 0.015) },
        { opacity: 0, offset: to },
        { opacity: 0 },
      ]
    }
    rewindRef.current?.animate(shownBetween(0, plan.scrubbedBack), options)
    oldRef.current?.animate(
      shownBetween(plan.scrubbedBack, plan.flatlined),
      options,
    )
    redrawRef.current?.animate(
      shownBetween(plan.flatlined, plan.redrawn),
      options,
    )
    playRef.current?.animate(
      shownBetween(plan.redrawn, plan.total * 0.98),
      options,
    )
    scanRef.current?.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: at(plan.scrubbedBack * 0.2) },
        { opacity: 0.6, offset: at(plan.scrubbedBack) },
        { opacity: 0.25, offset: at(plan.flatlined) },
        { opacity: 0.25, offset: at(plan.redrawn) },
        { opacity: 0.7, offset: at(plan.redrawn + 200) },
        { opacity: 0 },
      ],
      options,
    )
    bandRef.current?.animate(
      [
        { transform: 'translateY(-30%)', opacity: 0.9 },
        {
          transform: 'translateY(420%)',
          opacity: 0.7,
          offset: at(plan.scrubbedBack),
        },
        {
          transform: 'translateY(-30%)',
          opacity: 0,
          offset: at(plan.scrubbedBack + 20),
        },
        {
          transform: 'translateY(-30%)',
          opacity: 0,
          offset: at(plan.redrawn),
        },
        { transform: 'translateY(420%)', opacity: 0.6 },
      ],
      options,
    )
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={scanRef}
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, color-mix(in oklab, var(--primary) 9%, transparent) 0 1px, transparent 1px 3px)',
        }}
      />
      <div
        ref={bandRef}
        className="absolute inset-x-0 top-0 h-1/4 opacity-0 blur-[2px]"
        style={{
          backgroundImage:
            'linear-gradient(180deg, transparent, color-mix(in oklab, var(--primary) 10%, transparent) 40%, color-mix(in oklab, var(--primary) 16%, transparent) 55%, transparent)',
        }}
      />
      <div className="absolute top-2 left-3 font-bold font-mono text-[11px] text-brand tracking-wider sm:text-[13px] md:top-3 md:left-4 md:text-base">
        <span ref={rewindRef} className="absolute whitespace-nowrap opacity-0">
          ◀◀ REWIND
        </span>
        <span
          ref={oldRef}
          className="absolute whitespace-nowrap text-negative opacity-0"
        >
          ✕ {slots}: OLD {reorg.depth === 1 ? 'BLOCK' : 'BRANCH'}
        </span>
        <span ref={redrawRef} className="absolute whitespace-nowrap opacity-0">
          ● {slots}: NEW {reorg.depth === 1 ? 'BLOCK' : 'BRANCH'}
        </span>
        <span ref={playRef} className="absolute whitespace-nowrap opacity-0">
          ▶▶ BACK TO NOW
        </span>
      </div>
    </div>
  )
}
