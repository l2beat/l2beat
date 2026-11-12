import { useLayoutEffect, useRef } from 'react'
import type { Reorg } from '../../../live/types'
import { formatInteger } from '../format'
import { REWIND, REWIND_MS } from '../useRewind'

/**
 * A tape deck's on-screen display over the trace while it rewinds: the
 * mode in the corner, scanlines, and a tracking band rolling down. Opacity
 * and transform only, so it costs the compositor and not the page.
 */
export function VhsOverlay({ reorg }: { reorg: Reorg }) {
  const scanRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const rewindRef = useRef<HTMLSpanElement>(null)
  const replaceRef = useRef<HTMLSpanElement>(null)
  const playRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const options = { duration: REWIND_MS, fill: 'forwards' as const }
    const shownBetween = (from: number, to: number) => [
      { opacity: 0 },
      { opacity: 0, offset: from },
      { opacity: 1, offset: Math.min(to, from + 0.02) },
      { opacity: 1, offset: Math.max(from, to - 0.02) },
      { opacity: 0, offset: to },
      { opacity: 0 },
    ]
    rewindRef.current?.animate(shownBetween(0, REWIND.flatlined), options)
    replaceRef.current?.animate(
      shownBetween(REWIND.flatlined, REWIND.redrawn),
      options,
    )
    playRef.current?.animate(shownBetween(REWIND.redrawn, 0.98), options)
    scanRef.current?.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.05 },
        { opacity: 0.6, offset: REWIND.scrubbedBack },
        { opacity: 0.25, offset: REWIND.redrawn },
        { opacity: 0.7, offset: 0.8 },
        { opacity: 0 },
      ],
      options,
    )
    bandRef.current?.animate(
      [
        { transform: 'translateY(-30%)', opacity: 0.9 },
        { transform: 'translateY(420%)', opacity: 0.7, offset: 0.3 },
        { transform: 'translateY(-30%)', opacity: 0, offset: 0.31 },
        { transform: 'translateY(-30%)', opacity: 0, offset: 0.7 },
        { transform: 'translateY(420%)', opacity: 0.6 },
      ],
      { duration: REWIND_MS, fill: 'forwards' },
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
      <div className="absolute top-2 left-3 font-bold font-mono text-[13px] text-brand tracking-wider md:top-3 md:left-4 md:text-base">
        <span ref={rewindRef} className="absolute whitespace-nowrap opacity-0">
          ◀◀ REWIND
        </span>
        <span ref={replaceRef} className="absolute whitespace-nowrap opacity-0">
          ● SLOT {formatInteger(reorg.slot)}: NEW BLOCK
        </span>
        <span ref={playRef} className="absolute whitespace-nowrap opacity-0">
          ▶▶ BACK TO NOW
        </span>
      </div>
    </div>
  )
}
