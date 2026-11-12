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
import { REWIND, REWIND_MS, type Rewind } from '../useRewind'
import type { SlotClock } from '../useSlotClock'
import { BeatTooltip } from './BeatTooltip'
import {
  BEAT_END,
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
/** Of the width, where a rewind stops to replace a beat */
const CUE_AT = 0.6
/** The spike, as a fraction into its slot */
const BEAT_CENTER = 0.15

type Entrance = 'none' | 'live' | 'replacement'

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
      // cues the replaced beat up left of centre, clear of the pen and the
      // card's edge on a phone, wherever it was when the reorg came
      const beatX =
        penX -
        (reading.position + PEN_LEAD - reorg.slot - BEAT_CENTER) * g.slotWidth
      return width * CUE_AT - beatX
    },
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

  const entranceOf = (block: HeadBlock): Entrance => {
    if (playing?.slot === block.slot && playing.by.hash === block.hash) {
      return 'replacement'
    }
    if (block === head && block.slot > (firstHead.current ?? head.slot)) {
      return 'live'
    }
    return 'none'
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
              {visible.map((block) => (
                <Beat
                  key={`${block.slot}-${block.hash ?? 'missed'}`}
                  block={block}
                  x={xOf(block.slot)}
                  g={g}
                  limits={limits}
                  entrance={entranceOf(block)}
                  hovered={hover?.block.slot === block.slot}
                />
              ))}
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
              {playing && (
                <FlatliningBeat
                  key={playing.seenAt}
                  reorg={playing}
                  x={xOf(playing.slot)}
                  g={g}
                  limits={limits}
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
      {playing && <VhsOverlay key={playing.seenAt} reorg={playing} />}
      {hover && (
        <BeatTooltip
          block={hover.block}
          limits={limits}
          x={hover.x}
          width={width}
          replacedBy={
            rewind.notice?.slot === hover.block.slot ? rewind.notice : undefined
          }
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
  entrance,
  hovered,
}: {
  block: HeadBlock
  x: number
  g: TraceGeometry
  limits: BlockLimits
  entrance: Entrance
  hovered: boolean
}) {
  const lineRef = useRef<SVGPathElement>(null)
  const waveRef = useRef<SVGGElement>(null)
  const paths = beatPaths(block, limits, g)

  useLayoutEffect(() => {
    if (entrance === 'none') return
    const replacing = entrance === 'replacement'
    const delay = replacing ? REWIND_MS * REWIND.flatlined : 0
    const duration = replacing
      ? REWIND_MS * (REWIND.redrawn - REWIND.flatlined)
      : DRAW_MS
    const draw = {
      duration,
      delay,
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
  }, [entrance])

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
      </g>
      <path
        ref={lineRef}
        d={paths.line}
        pathLength={1}
        strokeDasharray={entrance === 'none' ? undefined : '1 1'}
        className="fill-none stroke-brand"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {paths.waveLine && (
        <path
          d={paths.waveLine}
          className="fill-none stroke-chart-ethereum"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
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

/** The replaced block's beat, shown again only to be flattened */
function FlatliningBeat({
  reorg,
  x,
  g,
  limits,
}: {
  reorg: Reorg
  x: number
  g: TraceGeometry
  limits: BlockLimits
}) {
  const ref = useRef<SVGGElement>(null)
  const markRef = useRef<SVGRectElement>(null)
  const paths = beatPaths(reorg.replaced, limits, g)
  useLayoutEffect(() => {
    markRef.current?.animate(
      [
        { opacity: 0 },
        { opacity: 0, offset: REWIND.scrubbedBack - 0.04 },
        { opacity: 1, offset: REWIND.scrubbedBack },
        { opacity: 1, offset: REWIND.redrawn },
        { opacity: 0, offset: 0.8 },
        { opacity: 0 },
      ],
      { duration: REWIND_MS, fill: 'forwards' },
    )
    const b = g.baseline
    const flat = `translateY(${b}px) scaleY(0.02) translateY(${-b}px)`
    ref.current?.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: 'none', opacity: 1, offset: REWIND.scrubbedBack },
        {
          transform: flat,
          opacity: 1,
          offset: REWIND.flatlined,
          easing: 'ease-in',
        },
        { transform: flat, opacity: 0.6, offset: REWIND.redrawn },
        { transform: flat, opacity: 0 },
      ],
      { duration: REWIND_MS, fill: 'forwards' },
    )
  }, [g.baseline])
  return (
    <g transform={`translate(${x} 0)`}>
      <rect
        ref={markRef}
        x={0}
        y={4}
        width={g.slotWidth * BEAT_END}
        height={g.height - 24}
        rx={4}
        className="fill-brand/10 opacity-0"
      />
      <g ref={ref}>
        {paths.wave && <path d={paths.wave} className="fill-negative/15" />}
        <path
          d={paths.line}
          className="fill-none stroke-negative"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </g>
    </g>
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
}: {
  playing: Reorg | undefined
  rewindRef: React.RefObject<SVGGElement | null>
  svgRef: React.RefObject<SVGSVGElement | null>
  distance: () => number
  overshoot: number
}) {
  const seenAt = playing?.seenAt
  // biome-ignore lint/correctness/useExhaustiveDependencies: each reorg plays once, measured when it starts
  useLayoutEffect(() => {
    if (seenAt === undefined) return
    const d = distance()
    // past the replaced beat and back, so it reads as scrubbing, not sliding
    const deepest = Math.max(d, 0) + overshoot
    const at = (offset: number, x: number, skew = 0, y = 0) => ({
      offset,
      transform: `translate(${x}px, ${y}px) skewX(${skew}deg)`,
    })
    const tape = rewindRef.current?.animate(
      [
        at(0, 0),
        at(0.05, deepest * 0.3, -4, 1),
        at(0.1, deepest * 0.7, 3, -1),
        at(0.15, deepest, -5, 2),
        at(0.2, d + (deepest - d) * 0.35, 2, -1),
        at(0.24, d - overshoot * 0.05, -1),
        at(REWIND.scrubbedBack, d),
        at(REWIND.redrawn, d),
        at(0.78, d * 0.62, 2, 1),
        at(0.86, d * 0.24, -2),
        at(1, 0),
      ],
      { duration: REWIND_MS, easing: 'ease-in-out' },
    )
    const split = (px: number) =>
      `drop-shadow(${px}px 0 0 rgb(0 214 255 / 0.7)) drop-shadow(${-px}px 0 0 rgb(255 0 92 / 0.7))`
    const glitch = svgRef.current?.animate(
      [
        { filter: split(0) },
        { filter: split(3), offset: 0.04 },
        { filter: split(1), offset: 0.12 },
        { filter: split(4), offset: 0.2 },
        { filter: split(0), offset: REWIND.scrubbedBack + 0.02 },
        { filter: split(0), offset: REWIND.redrawn },
        { filter: split(2), offset: 0.78 },
        { filter: split(0), offset: 0.95 },
        { filter: split(0) },
      ],
      { duration: REWIND_MS },
    )
    return () => {
      tape?.cancel()
      glitch?.cancel()
    }
  }, [seenAt])
}
