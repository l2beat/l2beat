import { useLayoutEffect, useRef } from 'react'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { HeadBlock, Reorg } from '../../../live/types'
import { formatBlockNumber, shortHash } from '../format'
import { REWIND_MS } from '../state/rewind'
import { FLOAT, LAND } from '../ui/spring'
import { RewindGlyph } from './RewindSweep'

/** Blocks before the fork shown in the lens, for context */
const CONTEXT = 3

/**
 * Timings of the reorg replay, in ms from when the page learns of it. The
 * numbers on the page roll back when the replacement lands.
 */
const T = {
  open: 0,
  rewind: 260,
  peel: 760,
  land: 1300,
  forward: 2200,
  close: REWIND_MS - 520,
}

/**
 * A magnifier that opens over the head when a reorg lands and replays it
 * large: the tape rewinds to the fork point, the replaced block peels off
 * onto a side branch, the replacement drops into its slot, and the tape
 * plays forward again. Then it folds back into the chain, where the small
 * uncle stays. Mainnet reorgs are rare and one block deep, so it's a show,
 * not an alarm: blue, not red.
 */
export function ForkLens({
  reorg,
  blocks,
  maxBlobs,
}: {
  reorg: Reorg
  blocks: HeadBlock[]
  maxBlobs: number
}) {
  const lensRef = useRef<HTMLDivElement>(null)
  const orphanRef = useRef<HTMLDivElement>(null)
  const replacementRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<SVGPathElement>(null)
  const washRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const replacedCaptionRef = useRef<HTMLDivElement>(null)

  const at = blocks.findIndex((b) => b.slot === reorg.slot)
  const context = blocks.slice(Math.max(0, at - CONTEXT), Math.max(0, at))

  useLayoutEffect(() => {
    const lens = lensRef.current
    const orphan = orphanRef.current
    const replacement = replacementRef.current
    const branch = branchRef.current
    const wash = washRef.current
    const playhead = playheadRef.current
    if (!lens || !orphan || !replacement || !branch || !wash || !playhead)
      return
    const total = REWIND_MS
    const off = (ms: number) => ms / total

    lens.animate(
      [
        {
          transform: 'scale(0.08)',
          opacity: 0,
          offset: 0,
          easing: LAND.easing,
        },
        { transform: 'scale(1)', opacity: 1, offset: off(T.open + 420) },
        {
          transform: 'scale(1)',
          opacity: 1,
          offset: off(T.close),
          easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)',
        },
        { transform: 'scale(0.08)', opacity: 0, offset: 1 },
      ],
      { duration: total, fill: 'both' },
    )

    const span = wash.getBoundingClientRect().width
    const sweep = (el: HTMLElement, out: Keyframe, home: Keyframe) =>
      el.animate(
        [
          { ...out, offset: 0 },
          {
            ...out,
            offset: off(T.rewind),
            easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
          },
          { ...home, offset: off(T.peel) },
          { ...home, offset: off(T.forward), easing: EASE_OUT_QUINT },
          { ...out, offset: off(T.close) },
          { ...out, offset: 1 },
        ],
        { duration: total, fill: 'both' },
      )
    sweep(
      wash,
      { clipPath: 'inset(0 0 0 100%)' },
      { clipPath: 'inset(0 0 0 0)' },
    )
    sweep(
      playhead,
      { transform: `translateX(${span}px)`, opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 },
    )

    orphan.animate(
      [
        { transform: 'none', filter: 'saturate(1)', opacity: 1 },
        {
          transform: 'translate(10%, -30%) rotate(-7deg) scale(0.92)',
          offset: 0.25,
        },
        {
          transform: 'translate(46%, -100%) rotate(-11deg) scale(0.62)',
          filter: 'saturate(0.3)',
          opacity: 0.75,
        },
      ],
      {
        duration: FLOAT.duration,
        easing: FLOAT.easing,
        delay: T.peel,
        fill: 'both',
      },
    )
    branch.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      delay: T.peel + 250,
      easing: EASE_OUT_QUINT,
      fill: 'both',
    })
    replacement.animate(
      [
        {
          transform: 'translateY(-70%) scale(0.5)',
          opacity: 0,
          filter: 'brightness(1.8)',
        },
        { transform: 'none', opacity: 1, filter: 'none' },
      ],
      {
        duration: LAND.duration,
        easing: LAND.easing,
        delay: T.land,
        fill: 'both',
      },
    )
    const fadeIn = (el: HTMLElement | null, delay: number) =>
      el?.animate(
        [
          { opacity: 0, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 400, delay, easing: EASE_OUT_QUINT, fill: 'both' },
      )
    fadeIn(replacedCaptionRef.current, T.peel + 500)
    fadeIn(captionRef.current, T.land + 300)
  }, [])

  return (
    <div
      ref={lensRef}
      aria-hidden
      className="pointer-events-none absolute top-full right-2 z-50 mt-2 w-[min(300px,calc(100vw-1rem))] origin-top-right rounded-2xl border border-chart-ethereum/40 bg-surface-primary p-4 shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--chart-ethereum)_55%,transparent),0_8px_20px_-8px_rgb(0_0_0/0.3)] md:right-4 dark:bg-header-secondary"
    >
      <div className="mb-3 flex items-center gap-2 font-bold text-[11px] text-chart-ethereum">
        <RewindGlyph className="size-3" />
        Replaying the reorg
      </div>
      <div className="relative mx-auto w-fit">
        {/* the branch lane: where the orphan ends up */}
        <div className="h-20" />
        <div className="relative flex gap-2">
          {context.map((b) => (
            <LensTile key={b.slot} block={b} maxBlobs={maxBlobs} />
          ))}
          <div className="relative">
            <div ref={replacementRef}>
              <LensTile block={reorg.by} maxBlobs={maxBlobs} highlight />
            </div>
            <div ref={orphanRef} className="absolute inset-0 origin-bottom">
              <LensTile block={reorg.replaced} maxBlobs={maxBlobs} orphan />
            </div>
          </div>
          <div className="w-9 rounded-md border border-brand/50 border-dashed" />
        </div>
        <svg
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={branchRef}
            d={branchPath(context.length)}
            fill="none"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            className="stroke-chart-ethereum"
          />
        </svg>
        <div
          ref={washRef}
          className="absolute inset-0 overflow-hidden"
          style={{ left: forkLeft(context.length) }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,color-mix(in_oklab,var(--chart-ethereum)_30%,transparent)_0_2px,transparent_2px_5px)] bg-chart-ethereum/10" />
        </div>
        <div
          ref={playheadRef}
          className="absolute inset-y-0 w-0.5 bg-chart-ethereum shadow-[0_0_12px_3px_color-mix(in_oklab,var(--chart-ethereum)_60%,transparent)]"
          style={{ left: forkLeft(context.length) }}
        />
      </div>
      <div className="mt-3 grid min-h-[34px] grid-cols-2 gap-3 text-[11px] leading-tight">
        <div ref={replacedCaptionRef} className="text-secondary">
          Replaced{' '}
          <span className="font-medium text-primary tabular-nums">
            {formatBlockNumber(reorg.replaced.number ?? 0)}
          </span>
          <br />
          <span className="font-mono">{shortHash(reorg.replaced.hash)}</span>
        </div>
        <div ref={captionRef} className="text-right text-secondary">
          Now in slot
          <br />
          <span className="font-mono text-chart-ethereum">
            {shortHash(reorg.by.hash)}
          </span>
        </div>
      </div>
    </div>
  )
}

/** Tiles are 36px wide with 8px gaps; the fork is the boundary before the replaced slot */
function forkLeft(contextCount: number) {
  return `${contextCount * 44 - 4}px`
}

/** From the parent's top to the orphan's resting place, up and to the right */
function branchPath(contextCount: number) {
  // in a box of 100 × 100 over the 80px lane and the 112px tiles
  const width = (contextCount + 2) * 44 - 8
  const parent = ((contextCount * 44 - 26) / width) * 100
  const orphan = ((contextCount * 44 + 35) / width) * 100
  return `M ${parent} 42 C ${parent} 14, ${orphan - 20} 12, ${orphan - 8} 37`
}

function LensTile({
  block,
  maxBlobs,
  highlight = false,
  orphan = false,
}: {
  block: HeadBlock
  maxBlobs: number
  highlight?: boolean
  orphan?: boolean
}) {
  if (block.status === 'missed') {
    return (
      <div className="h-28 w-9 rounded-md border border-divider border-dashed" />
    )
  }
  return (
    <div
      className={cn(
        'relative h-28 w-9 rounded-md bg-surface-secondary shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_2px_4px_rgb(0_0_0/0.18)]',
        highlight && 'outline-2 outline-chart-ethereum outline-offset-2',
        orphan &&
          'outline-dashed outline-2 outline-chart-ethereum/80 outline-offset-2',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[calc(50%-1px)] overflow-hidden rounded-t-md">
        <div
          className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/70 to-primary/45"
          style={{
            height: `${Math.min(1, block.gasUsed / block.gasLimit) * 100}%`,
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[calc(50%-1px)] overflow-hidden rounded-b-md">
        <div
          className="absolute inset-x-0 top-0 bg-linear-to-b from-chart-teal to-chart-teal/70"
          style={{
            height: `${Math.min(1, block.blobCount / maxBlobs) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
