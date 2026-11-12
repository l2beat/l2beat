import { useLayoutEffect, useRef } from 'react'
import { cn } from '~/utils/cn'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { HeadBlock, Reorg } from '../../../live/types'
import { formatBlockNumber, shortHash } from '../format'
import { rewindTiming } from '../state/rewind'
import { FLOAT, LAND } from '../ui/spring'
import { RewindGlyph } from './RewindSweep'

/** Blocks before the fork point shown for context, the fork point included */
const CONTEXT = 3
/** The lens's inner width; tiles shrink to fit a deep fork into it */
const CONTENT_WIDTH = 268
const LANE = 64
const EASE_IN = 'cubic-bezier(0.5, 0, 0.75, 0)'

/**
 * A magnifier that opens over the head when a reorg lands and replays it
 * large: the tape rewinds to the fork point, the whole losing branch peels
 * off as one piece onto a side branch, the winning blocks land one by one,
 * and the tape plays forward. Then it folds back into the chain, where the
 * ghost branch stays. Reorgs are rare and shallow on mainnet, so it's a show,
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
  const orphansRef = useRef<HTMLDivElement>(null)
  const winnersRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<SVGPathElement>(null)
  const washRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)
  const captionsRef = useRef<HTMLDivElement>(null)

  const forkAt = blocks.findIndex((b) => b.slot === reorg.forkSlot)
  const context =
    forkAt < 0
      ? []
      : blocks.slice(Math.max(0, forkAt - CONTEXT + 1), forkAt + 1)
  const g = geometry(context.length, reorg.depth)

  // biome-ignore lint/correctness/useExhaustiveDependencies: one replay per mount, keyed by the reorg
  useLayoutEffect(() => {
    const lens = lensRef.current
    const orphans = orphansRef.current
    const branch = branchRef.current
    const wash = washRef.current
    const playhead = playheadRef.current
    if (!lens || !orphans || !branch || !wash || !playhead) return
    const t = rewindTiming(reorg.depth)
    const at = (ms: number) => Math.min(1, ms / t.total)
    const close = t.total - 520

    lens.animate(
      [
        {
          transform: 'scale(0.08)',
          opacity: 0,
          offset: 0,
          easing: LAND.easing,
        },
        { transform: 'scale(1)', opacity: 1, offset: at(420) },
        {
          transform: 'scale(1)',
          opacity: 1,
          offset: at(close),
          easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)',
        },
        { transform: 'scale(0.08)', opacity: 0, offset: 1 },
      ],
      { duration: t.total, fill: 'both' },
    )

    const sweep = (el: HTMLElement, out: Keyframe, home: Keyframe) =>
      el.animate(
        [
          { ...out, offset: 0 },
          { ...out, offset: at(t.rewindStart), easing: EASE_IN },
          { ...home, offset: at(t.rewindEnd) },
          { ...home, offset: at(t.forward), easing: EASE_OUT_QUINT },
          { ...out, offset: at(t.forward + 700) },
          { ...out, offset: 1 },
        ],
        { duration: t.total, fill: 'both' },
      )
    const span = wash.getBoundingClientRect().width
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

    orphans.animate(
      [
        { transform: 'none', filter: 'saturate(1)', opacity: 1 },
        {
          transform: 'translate(2%, -28%) rotate(-4deg) scale(0.97, 0.85)',
          offset: 0.3,
        },
        { transform: g.orphanRest, filter: 'saturate(0.35)', opacity: 0.75 },
      ],
      {
        duration: FLOAT.duration,
        easing: FLOAT.easing,
        delay: t.peel,
        fill: 'both',
      },
    )
    branch.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      delay: t.peel + 350,
      fill: 'both',
    })
    const winners = winnersRef.current?.children ?? []
    for (let i = 0; i < winners.length; i++) {
      winners[i]?.animate(
        [
          {
            transform: 'translateY(-60%) scale(0.5)',
            opacity: 0,
            filter: 'brightness(1.8)',
          },
          { transform: 'none', opacity: 1, filter: 'none' },
        ],
        {
          duration: LAND.duration,
          easing: LAND.easing,
          delay: t.landAt(i),
          fill: 'both',
        },
      )
    }
    captionsRef.current?.animate(
      [
        { opacity: 0, transform: 'translateY(4px)' },
        { opacity: 1, transform: 'none' },
      ],
      {
        duration: 400,
        delay: t.peel + 300,
        easing: EASE_OUT_QUINT,
        fill: 'both',
      },
    )
  }, [])

  const replacedBlocks = reorg.replaced.filter((b) => b.number !== undefined)
  const first = replacedBlocks[0]?.number
  const last = replacedBlocks.at(-1)?.number

  return (
    <div
      ref={lensRef}
      aria-hidden
      className="pointer-events-none absolute top-full right-2 z-50 mt-2 w-[300px] max-w-[calc(100vw-1rem)] origin-top-right rounded-2xl border border-chart-ethereum/40 bg-surface-primary p-4 shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--chart-ethereum)_55%,transparent),0_8px_20px_-8px_rgb(0_0_0/0.3)] md:right-4 dark:bg-header-secondary"
    >
      <div className="mb-1 flex items-center gap-2 font-bold text-[11px] text-chart-ethereum">
        <RewindGlyph className="size-3" />
        Replaying a reorg, {reorg.depth} {reorg.depth === 1 ? 'slot' : 'slots'}{' '}
        deep
      </div>
      <div
        className="relative mx-auto"
        style={{ width: g.width, height: LANE + g.tileHeight }}
      >
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={g.width}
          height={LANE + g.tileHeight}
        >
          <path
            ref={branchRef}
            d={g.branch}
            fill="none"
            strokeWidth={2}
            className="stroke-chart-ethereum"
          />
        </svg>
        <div
          className="absolute inset-x-0 flex"
          style={{ top: LANE, gap: g.gap }}
        >
          {context.map((b, i) => (
            <LensTile
              key={b.slot}
              block={b}
              maxBlobs={maxBlobs}
              g={g}
              fork={i === context.length - 1}
            />
          ))}
          <div ref={winnersRef} className="flex" style={{ gap: g.gap }}>
            {reorg.by.map((b) => (
              <LensTile
                key={b.slot}
                block={b}
                maxBlobs={maxBlobs}
                g={g}
                highlight
              />
            ))}
          </div>
          <div
            className="shrink-0 rounded-md border border-brand/50 border-dashed"
            style={{ width: g.tileWidth, height: g.tileHeight }}
          />
        </div>
        <div
          ref={orphansRef}
          className="absolute flex origin-top-left"
          style={{ top: LANE, left: g.forkRight + g.gap, gap: g.gap }}
        >
          {reorg.replaced.map((b) => (
            <LensTile key={b.slot} block={b} maxBlobs={maxBlobs} g={g} orphan />
          ))}
        </div>
        <div
          ref={washRef}
          className="absolute right-0 bottom-0 overflow-hidden"
          style={{ left: g.forkRight + g.gap / 2, height: g.tileHeight + 12 }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,color-mix(in_oklab,var(--chart-ethereum)_30%,transparent)_0_2px,transparent_2px_5px)] bg-chart-ethereum/10" />
        </div>
        <div
          ref={playheadRef}
          className="absolute bottom-0 w-0.5 bg-chart-ethereum shadow-[0_0_12px_3px_color-mix(in_oklab,var(--chart-ethereum)_60%,transparent)]"
          style={{
            left: g.forkRight + g.gap / 2 - 1,
            height: g.tileHeight + 12,
          }}
        />
      </div>
      <div
        ref={captionsRef}
        className="mt-3 grid grid-cols-2 gap-3 text-[11px] leading-tight"
      >
        <div className="text-secondary">
          Orphaned
          <br />
          <span className="font-medium text-primary tabular-nums">
            {first === undefined
              ? 'no blocks'
              : first === last
                ? formatBlockNumber(first)
                : `${formatBlockNumber(first)} – ${formatBlockNumber(last ?? first)}`}
          </span>
        </div>
        <div className="text-right text-secondary">
          New head
          <br />
          <span className="font-mono text-chart-ethereum">
            {shortHash(reorg.by.at(-1)?.hash)}
          </span>
        </div>
      </div>
    </div>
  )
}

interface LensGeometry {
  tileWidth: number
  tileHeight: number
  gap: number
  width: number
  /** Right edge of the fork point's tile */
  forkRight: number
  orphanRest: string
  branch: string
}

/** Sizes the tiles so context, every rewritten slot and the next one fit */
function geometry(contextCount: number, depth: number): LensGeometry {
  const count = contextCount + depth + 1
  const gap = count > 6 ? 5 : 8
  const tileWidth = Math.min(
    36,
    Math.floor((CONTENT_WIDTH - (count - 1) * gap) / count),
  )
  const tileHeight = tileWidth >= 30 ? 112 : 96
  const step = tileWidth + gap
  const width = count * step - gap
  const forkRight = contextCount * step - gap
  // the losing branch rests squashed in the lane, a little to the right of where it forked
  const restScale = (LANE - 10) / tileHeight
  const shift = gap * 1.5
  const orphanRest = `translate(${shift}px, ${6 - LANE}px) scale(0.94, ${restScale.toFixed(3)})`
  const forkX = forkRight - tileWidth / 2
  const restLeft = forkRight + gap + shift
  const restMid = 6 + (tileHeight * restScale) / 2
  const branch =
    contextCount > 0
      ? `M ${forkX} ${LANE} C ${forkX} ${restMid}, ${forkX + 4} ${restMid}, ${restLeft} ${restMid}`
      : ''
  return { tileWidth, tileHeight, gap, width, forkRight, orphanRest, branch }
}

function LensTile({
  block,
  maxBlobs,
  g,
  highlight = false,
  orphan = false,
  fork = false,
}: {
  block: HeadBlock
  maxBlobs: number
  g: LensGeometry
  highlight?: boolean
  orphan?: boolean
  fork?: boolean
}) {
  const size = { width: g.tileWidth, height: g.tileHeight }
  if (block.status === 'missed') {
    return (
      <div
        className={cn(
          'shrink-0 rounded-md border border-dashed',
          orphan || highlight ? 'border-chart-ethereum/70' : 'border-divider',
        )}
        style={size}
      />
    )
  }
  return (
    <div
      className={cn(
        'relative shrink-0 rounded-md bg-surface-secondary shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_2px_4px_rgb(0_0_0/0.18)]',
        highlight && 'outline-2 outline-chart-ethereum outline-offset-2',
        orphan &&
          'outline-dashed outline-2 outline-chart-ethereum/80 outline-offset-2',
        fork && 'outline-2 outline-primary/60 outline-offset-2',
      )}
      style={size}
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
