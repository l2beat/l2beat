import {
  memo,
  type PointerEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useElementSize } from '~/hooks/useElementSize'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { EASE_OUT_QUINT } from '~/utils/easing'
import type { BlockLimits, HeadBlock, Reorg } from '../../../live/types'
import {
  type Rewind,
  type RewindPlan,
  reorgRange,
  replacedAt,
} from '../useRewind'
import type { SlotClock } from '../useSlotClock'
import { BeatTooltip } from './BeatTooltip'
import {
  beatPaths,
  PEN_LEAD,
  type TraceGeometry,
  toGeometry,
} from './beatShape'
import { VhsOverlay } from './VhsOverlay'

/** Of the width, where the pen writes: the strip right of it is the next slot coming */
const PEN_AT = 0.86
/** A minute of slots, so grid lines fall a minute apart */
const GRID_SLOTS = 5
const DRAW_MS = 520
/** Of the width, where a rewind centres the slots it replaces */
const CUE_AT = 0.58

/**
 * The page's heartbeat: a monitor trace that writes one beat per block and
 * scrolls left as the slot passes. A reorg rewinds the tape to the replaced
 * beat, flatlines it and writes its replacement in its place.
 */
export function Heartbeat({
  blocks,
  limits,
  clock,
  rewind,
  className,
}: {
  blocks: HeadBlock[]
  limits: BlockLimits
  clock: SlotClock
  rewind: Rewind
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const tapeRef = useRef<SVGGElement>(null)
  const rewindRef = useRef<SVGGElement>(null)
  const penRef = useRef<SVGCircleElement>(null)
  const clipId = useId()
  const { width, height } = useElementSize(containerRef)
  const onScreen = useIsOnScreen(containerRef)
  const g = useMemo(() => toGeometry(width, height), [width, height])
  const penX = Math.round(width * PEN_AT)
  const head = blocks.at(-1)
  // Tape coordinates count from a slot fixed at first sight: counting from
  // genesis would put beats hundreds of millions of pixels out
  const origin = useRef<number | undefined>(undefined)
  if (origin.current === undefined && head) origin.current = head.slot - 64
  const firstHead = useRef<number | undefined>(undefined)
  if (firstHead.current === undefined && head) firstHead.current = head.slot
  const [hover, setHover] = useState<{ block: HeadBlock; x: number }>()

  const tapeX = (now: number) => {
    const reading = clock.read(now)
    if (!reading || origin.current === undefined) return undefined
    // without motion the tape steps a slot at a time instead of gliding
    const position = rewind.reducedMotion
      ? Math.floor(reading.position)
      : reading.position
    return penX - (position - origin.current + PEN_LEAD) * g.slotWidth
  }

  useEffect(() => {
    if (!onScreen || width === 0) return
    let frame = requestAnimationFrame(function step() {
      const x = tapeX(Date.now())
      if (x !== undefined && tapeRef.current) {
        tapeRef.current.style.transform = `translateX(${x}px)`
      }
      frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  })

  usePenBeat(penRef, head?.slot, rewind.reducedMotion)
  useRewindScrub({
    playing: rewind.playing,
    rewindRef,
    svgRef,
    distance: () => {
      const reorg = rewind.playing
      const reading = clock.read(Date.now())
      if (!reorg || !reading) return 0
      // cues the rewritten slots up around the middle, clear of the pen and
      // of the card's edge on a phone, wherever they were when it came
      const { first, last } = reorgRange(reorg)
      const middle = (first + last + 1) / 2
      const middleX =
        penX - (reading.position + PEN_LEAD - middle) * g.slotWidth
      return width * CUE_AT - middleX
    },
    plan: rewind.plan,
    overshoot: g.slotWidth * 3.5,
  })

  if (width === 0 || !head || origin.current === undefined) {
    return (
      <div ref={containerRef} className={cn('relative', className)} aria-hidden>
        <FlatTrace />
      </div>
    )
  }

  const shown = Math.ceil(width / g.slotWidth) + 2
  const visible = blocks.filter((b) => b.slot > head.slot - shown)
  const xOf = (slot: number) => (slot - (origin.current ?? 0)) * g.slotWidth
  const playing = rewind.playing
  const gridSlots = visible.filter((b) => b.slot % GRID_SLOTS === 0)

  const plan = rewind.plan
  /** When a beat is drawn rather than simply shown: as it arrives, or in its turn during a rewind */
  const drawOf = (block: HeadBlock) => {
    if (playing && plan) {
      const i = playing.by.findIndex(
        (b) => b.slot === block.slot && b.hash === block.hash,
      )
      const draw = plan.draws[i]
      if (draw) return draw
    }
    if (block === head && block.slot > (firstHead.current ?? head.slot)) {
      return { delay: 0, duration: DRAW_MS }
    }
    return undefined
  }

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const tape = tapeX(Date.now())
    if (tape === undefined || x > penX + 8) return setHover(undefined)
    const slot = Math.floor((x - tape) / g.slotWidth) + (origin.current ?? 0)
    const block = blocks.find((b) => b.slot === slot)
    setHover(block ? { block, x } : undefined)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block touch-pan-y overflow-visible"
        role="img"
        aria-label={`Heartbeat of the last ${visible.length} slots: each spike is how full a block was, each wave how many blobs it carried`}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerMove}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setHover(undefined)
        }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={0}
              y={0}
              width={playing ? width : penX + 1}
              height={height}
            />
          </clipPath>
        </defs>
        <line
          x1={0}
          x2={width}
          y1={g.baseline - g.targetRise}
          y2={g.baseline - g.targetRise}
          className="stroke-secondary/50"
          strokeDasharray="3 5"
          strokeWidth={1}
        />
        <text
          x={width - 4}
          y={g.baseline - g.targetRise - 6}
          textAnchor="end"
          className="fill-secondary text-[11px]"
        >
          target
        </text>
        <g clipPath={`url(#${clipId})`}>
          {/* moved every frame: with reduced motion the site gives every
              element a short transition, which would never let it land */}
          <g ref={tapeRef} className="transition-none">
            <g ref={rewindRef}>
              {gridSlots.map((b) => (
                <GridLine key={b.slot} block={b} x={xOf(b.slot)} g={g} />
              ))}
              {playing && plan && (
                <OldBranch
                  key={playing.seenAt}
                  reorg={playing}
                  plan={plan}
                  xOf={xOf}
                  g={g}
                  limits={limits}
                />
              )}
              {visible.map((block) => {
                const draw = drawOf(block)
                return (
                  <Beat
                    key={`${block.slot}-${block.hash ?? 'missed'}`}
                    block={block}
                    x={xOf(block.slot)}
                    g={g}
                    limits={limits}
                    drawDelay={draw?.delay}
                    drawDuration={draw?.duration}
                    hovered={hover?.block.slot === block.slot}
                  />
                )
              })}
              {/* the pen keeps drawing flat line while a block is late;
                  a rewind shows the tape unclipped, where it would dangle */}
              {!playing && (
                <path
                  d={`M${xOf(head.slot + 1)} ${g.baseline}h${g.slotWidth * 1.5}`}
                  className="fill-none stroke-brand"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>
        </g>
        <circle
          cx={penX}
          cy={g.baseline}
          r={11}
          className="origin-center fill-brand/15 [transform-box:fill-box]"
          ref={penRef}
        />
        <circle cx={penX} cy={g.baseline} r={3.5} className="fill-brand" />
      </svg>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-surface-primary to-transparent md:w-28" />
      {playing && plan && (
        <VhsOverlay key={playing.seenAt} reorg={playing} plan={plan} />
      )}
      {hover && (
        <BeatTooltip
          block={hover.block}
          limits={limits}
          x={hover.x}
          width={width}
          replaced={replacedAt(rewind.notice, hover.block.slot)}
        />
      )}
    </div>
  )
}

const Beat = memo(function Beat({
  block,
  x,
  g,
  limits,
  drawDelay,
  drawDuration,
  hovered,
}: {
  block: HeadBlock
  x: number
  g: TraceGeometry
  limits: BlockLimits
  /** Milliseconds; the beat is shown as it is when undefined */
  drawDelay: number | undefined
  drawDuration: number | undefined
  hovered: boolean
}) {
  const lineRef = useRef<SVGPathElement>(null)
  const waveRef = useRef<SVGGElement>(null)
  const paths = beatPaths(block, limits, g)

  useLayoutEffect(() => {
    if (drawDelay === undefined || drawDuration === undefined) return
    const draw = {
      duration: drawDuration,
      delay: drawDelay,
      easing: EASE_OUT_QUINT,
      fill: 'backwards' as const,
    }
    lineRef.current?.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      draw,
    )
    waveRef.current?.animate(
      [{ opacity: 0 }, { opacity: 0, offset: 0.4 }, { opacity: 1 }],
      draw,
    )
  }, [drawDelay, drawDuration])

  return (
    <g transform={`translate(${x} 0)`}>
      {hovered && (
        <rect
          x={0}
          y={0}
          width={g.slotWidth}
          height={g.height}
          className="fill-primary/5"
        />
      )}
      <g ref={waveRef}>
        {paths.wave && (
          <path d={paths.wave} className="fill-chart-ethereum/25" />
        )}
        {paths.waveLine && (
          <path
            d={paths.waveLine}
            className="fill-none stroke-chart-ethereum"
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
      </g>
      <path
        ref={lineRef}
        d={paths.line}
        pathLength={1}
        strokeDasharray={drawDelay === undefined ? undefined : '1 1'}
        className="fill-none stroke-brand"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {block.status === 'missed' && (
        <circle
          cx={g.slotWidth * 0.15}
          cy={g.baseline}
          r={2.5}
          className="fill-surface-primary stroke-secondary"
          strokeWidth={1.5}
        />
      )}
    </g>
  )
})

/**
 * The branch the page had, drawn over the slots it lost: it turns red so it
 * reads as what was, then every beat of it flatlines at once, under a band
 * that marks the whole rewritten range.
 */
function OldBranch({
  reorg,
  plan,
  xOf,
  g,
  limits,
}: {
  reorg: Reorg
  plan: RewindPlan
  xOf: (slot: number) => number
  g: TraceGeometry
  limits: BlockLimits
}) {
  const bandRef = useRef<SVGGElement>(null)
  const branchRef = useRef<SVGGElement>(null)
  const { first, last } = reorgRange(reorg)
  const at = (ms: number) => ms / plan.total

  // biome-ignore lint/correctness/useExhaustiveDependencies: plays once per reorg, keyed by it
  useLayoutEffect(() => {
    const options = { duration: plan.total, fill: 'forwards' as const }
    bandRef.current?.animate(
      [
        { opacity: 0 },
        { opacity: 0, offset: at(plan.scrubbedBack * 0.8) },
        { opacity: 1, offset: at(plan.scrubbedBack) },
        { opacity: 1, offset: at(plan.redrawn) },
        { opacity: 0, offset: at(plan.redrawn + 300) },
        { opacity: 0 },
      ],
      options,
    )
    const b = g.baseline
    const flat = `translateY(${b}px) scaleY(0.02) translateY(${-b}px)`
    branchRef.current?.animate(
      [
        { transform: 'none', stroke: 'var(--brand)', opacity: 1 },
        {
          transform: 'none',
          stroke: 'var(--brand)',
          opacity: 1,
          offset: at(plan.scrubbedBack * 0.6),
        },
        {
          transform: 'none',
          stroke: 'var(--negative)',
          opacity: 1,
          offset: at(plan.scrubbedBack),
        },
        {
          transform: 'none',
          stroke: 'var(--negative)',
          opacity: 1,
          offset: at(plan.shownOld),
          easing: 'ease-in',
        },
        {
          transform: flat,
          stroke: 'var(--negative)',
          opacity: 0.55,
          offset: at(plan.flatlined),
        },
        // the flatline stays under the redraw, so each new beat is written over it
        {
          transform: flat,
          stroke: 'var(--negative)',
          opacity: 0.55,
          offset: at(plan.redrawn - 150),
        },
        {
          transform: flat,
          stroke: 'var(--negative)',
          opacity: 0,
          offset: at(plan.redrawn),
        },
        { transform: flat, stroke: 'var(--negative)', opacity: 0 },
      ],
      options,
    )
  }, [])

  const x0 = xOf(first)
  const bandWidth = xOf(last + 1) - x0
  return (
    <>
      <g ref={bandRef} className="opacity-0">
        <rect
          x={x0}
          y={4}
          width={bandWidth}
          height={g.height - 24}
          rx={6}
          className="fill-brand/[0.04] stroke-brand/40"
          strokeDasharray="4 4"
        />
      </g>
      <g ref={branchRef} className="stroke-brand">
        {reorg.replaced.map((block) => {
          const paths = beatPaths(block, limits, g)
          return (
            <g key={block.slot} transform={`translate(${xOf(block.slot)} 0)`}>
              {paths.wave && (
                <path d={paths.wave} className="fill-negative/15 stroke-none" />
              )}
              <path
                d={paths.line}
                className="fill-none"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            </g>
          )
        })}
      </g>
    </>
  )
}

function GridLine({
  block,
  x,
  g,
}: {
  block: HeadBlock
  x: number
  g: TraceGeometry
}) {
  return (
    <g transform={`translate(${x} 0)`}>
      <line
        x1={0}
        x2={0}
        y1={8}
        y2={g.height - 18}
        className="stroke-divider"
        strokeWidth={1}
      />
      <text
        x={-5}
        y={g.height - 4}
        textAnchor="end"
        className="fill-secondary text-[11px] tabular-nums"
      >
        {formatTimestamp(block.timestamp, { mode: 'time' })}
      </text>
    </g>
  )
}

/** Before the first block, the same trace with nothing on it, so nothing moves when it comes */
function FlatTrace() {
  return (
    <div className="absolute inset-x-0 top-[76%] flex items-center">
      <div className="h-0.5 flex-1 rounded-full bg-brand/30" />
      <div className="ml-[14%] size-2 rounded-full bg-brand/40" />
    </div>
  )
}

/** The pen's halo swells as each block is written */
function usePenBeat(
  ref: React.RefObject<SVGCircleElement | null>,
  slot: number | undefined,
  reducedMotion: boolean,
) {
  useLayoutEffect(() => {
    if (slot === undefined || reducedMotion) return
    ref.current?.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.9)', opacity: 0.2, offset: 0.35 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration: 900, easing: EASE_OUT_QUINT },
    )
  }, [slot, reducedMotion, ref])
}

/**
 * Scrubs the tape back like a VHS rewind, holds while the beat is replaced,
 * then plays forward to now. The tape's own position keeps gliding with the
 * slot underneath; this only adds the detour.
 */
function useRewindScrub({
  playing,
  rewindRef,
  svgRef,
  distance,
  overshoot,
  plan,
}: {
  playing: Reorg | undefined
  rewindRef: React.RefObject<SVGGElement | null>
  svgRef: React.RefObject<SVGSVGElement | null>
  distance: () => number
  overshoot: number
  plan: RewindPlan | undefined
}) {
  const seenAt = playing?.seenAt
  // biome-ignore lint/correctness/useExhaustiveDependencies: each reorg plays once, measured when it starts
  useLayoutEffect(() => {
    if (seenAt === undefined || !plan) return
    const d = distance()
    const back = plan.scrubbedBack / plan.total
    const hold = plan.redrawn / plan.total
    const forward = (fraction: number) => hold + (1 - hold) * fraction
    // past the replaced beat and back, so it reads as scrubbing, not sliding
    const deepest = Math.max(d, 0) + overshoot
    const at = (offset: number, x: number, skew = 0, y = 0) => ({
      offset,
      transform: `translate(${x}px, ${y}px) skewX(${skew}deg)`,
    })
    const tape = rewindRef.current?.animate(
      [
        at(0, 0),
        at(back * 0.18, deepest * 0.3, -4, 1),
        at(back * 0.37, deepest * 0.7, 3, -1),
        at(back * 0.55, deepest, -5, 2),
        at(back * 0.74, d + (deepest - d) * 0.35, 2, -1),
        at(back * 0.9, d - overshoot * 0.05, -1),
        at(back, d),
        at(hold, d),
        at(forward(0.32), d * 0.62, 2, 1),
        at(forward(0.58), d * 0.24, -2),
        at(1, 0),
      ],
      { duration: plan.total, easing: 'ease-in-out' },
    )
    const split = (px: number) =>
      `drop-shadow(${px}px 0 0 rgb(0 214 255 / 0.7)) drop-shadow(${-px}px 0 0 rgb(255 0 92 / 0.7))`
    const glitch = svgRef.current?.animate(
      [
        { filter: split(0) },
        { filter: split(3), offset: back * 0.15 },
        { filter: split(1), offset: back * 0.45 },
        { filter: split(4), offset: back * 0.75 },
        { filter: split(0), offset: back },
        { filter: split(0), offset: hold },
        { filter: split(2), offset: forward(0.32) },
        { filter: split(0), offset: forward(0.85) },
        { filter: split(0) },
      ],
      { duration: plan.total },
    )
    return () => {
      tape?.cancel()
      glitch?.cancel()
    }
  }, [seenAt])
}
