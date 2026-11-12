import {
  type ComponentProps,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { PointerTooltip } from '~/pages/blobs/components/live-blobs/PointerTooltip'
import { cn } from '~/utils/cn'
import {
  formatBlockNumber,
  formatBlockTime,
  formatGwei,
  formatInteger,
  formatMillions,
  formatPercent,
  formatSlotsAgo,
} from '../format'
import type { HeadBlock, Reorg } from '../live/types'
import { epochOf, SLOTS_PER_EPOCH } from '../metrics'
import { useAnchor } from '../state/anchor'
import { rewindTiming, useRewind } from '../state/rewind'
import { FOLLOW } from '../ui/spring'
import { ForkLens } from './ForkLens'
import {
  boundaryAfter,
  COLUMNS,
  columnAt,
  columnCenter,
  columnLeft,
  columnsWidth,
  TRACK_VARS,
  TRACK_WIDTH,
} from './geometry'
import { Countdown, NextSlotTile } from './NextSlot'
import { Notices } from './Notices'
import { RewindGlyph, RewindSweep } from './RewindSweep'
import { Tile } from './Tile'
import { UncleBranch } from './Uncle'
import { useChainMotion } from './useChainMotion'

/**
 * The last 64 slots as a chain of blocks, with how far finality has come.
 * Picking a block shows it in the block panel below; a reorg rewinds here.
 */
export function ChainTimeline() {
  const {
    head,
    block,
    isLive,
    slotsBehind,
    select,
    orphaned,
    viewReplacement,
  } = useAnchor()
  const { active } = useRewind()

  return (
    <div
      aria-label="The last 64 slots of Ethereum"
      data-rewinding={active !== undefined}
      className="group/strip max-md:-mx-4 relative border-divider bg-surface-secondary/40 transition-[box-shadow,border-color] duration-300 data-[rewinding=true]:border-chart-ethereum/70 data-[rewinding=true]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--chart-ethereum)_25%,transparent)] max-md:border-y md:rounded-xl md:border"
    >
      <div className="flex min-h-11 items-center justify-between gap-3 px-4 pt-2.5 md:px-5 md:pt-3">
        <StripStatus
          status={head.status}
          block={block}
          isLive={isLive}
          slotsBehind={slotsBehind}
          orphaned={orphaned !== undefined}
        />
        {isLive ? (
          <div className="flex items-center gap-4 text-label-value-13 text-secondary">
            <span className="max-lg:hidden">
              Drag along the chain to go back in time
            </span>
            {head.status !== 'connecting' && (
              <Countdown
                nextSlotAt={head.nextSlotAt}
                className="font-medium text-primary"
              />
            )}
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            {orphaned?.replacement?.status === 'proposed' && (
              <button
                type="button"
                onClick={viewReplacement}
                className="rounded-full border border-chart-ethereum/50 px-3 py-1.5 font-bold text-chart-ethereum text-label-value-13 transition-colors hover:bg-chart-ethereum/10"
              >
                <span className="max-sm:hidden">View the </span>replacement
              </button>
            )}
            <BackToLive onClick={() => select(undefined)} />
          </div>
        )}
      </div>
      <Track />
      <Notices />
      <Lens />
    </div>
  )
}

/** The reorg replay, unless the reader asked for less motion: the notice still says it */
function Lens() {
  const { head } = useAnchor()
  const { active } = useRewind()
  const reducedMotion = usePrefersReducedMotion()
  if (!active || reducedMotion) return null
  if (!head.blocks.some((b) => b.slot === active.forkSlot + 1)) return null
  return (
    <ForkLens
      key={active.seenAt}
      reorg={active}
      blocks={head.blocks}
      maxBlobs={head.limits.maxBlobs}
    />
  )
}

function BackToLive({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 font-bold text-label-value-13 text-white shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
    >
      <span className="size-1.5 rounded-full bg-white" />
      <span className="max-sm:hidden">Back to </span>live
    </button>
  )
}

function StripStatus({
  status,
  block,
  isLive,
  slotsBehind,
  orphaned,
}: {
  status: string
  block: HeadBlock | undefined
  isLive: boolean
  slotsBehind: number
  orphaned: boolean
}) {
  if (status === 'connecting' || !block) {
    return (
      <div className="flex items-center gap-2 font-medium text-label-value-14 text-secondary">
        <span className="size-2 animate-pulse rounded-full bg-secondary" />
        Connecting to the chain
      </div>
    )
  }
  if (isLive) {
    return (
      <div className="flex min-w-0 items-baseline gap-2 text-label-value-14">
        <span className="relative top-[-1px] flex size-2 self-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60" />
          <span className="relative size-2 rounded-full bg-brand" />
        </span>
        <span className="font-bold text-brand-deep">Live</span>
        <span className="truncate text-secondary">
          following the head
          <span className="max-sm:hidden">
            , block{' '}
            <span className="font-medium text-primary tabular-nums">
              {formatBlockNumber(block.number ?? 0)}
            </span>
          </span>
        </span>
      </div>
    )
  }
  if (orphaned) {
    return (
      <div className="flex min-w-0 items-center gap-2 text-label-value-14">
        <span className="size-3.5 shrink-0 rounded-[3px] border-[1.5px] border-chart-ethereum border-dashed" />
        <span className="truncate">
          <span className="font-bold tabular-nums">
            {formatBlockNumber(block.number ?? 0)}
          </span>
          <span className="text-secondary"> was replaced by a reorg</span>
        </span>
      </div>
    )
  }
  return (
    <div className="flex min-w-0 items-center gap-2 text-label-value-14">
      <RewindGlyph className="size-3.5 shrink-0 text-chart-ethereum" />
      <span className="truncate">
        <span className="font-bold tabular-nums">
          {formatBlockNumber(block.number ?? 0)}
        </span>
        <span className="text-secondary">
          , {slotsBehind} {slotsBehind === 1 ? 'slot' : 'slots'} (
          {formatSlotsAgo(slotsBehind)}) before the head
        </span>
      </span>
    </div>
  )
}

function Track() {
  const { head, block, selectedSlot, select, orphaned } = useAnchor()
  const rewind = useRewind()
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number>()
  const drag = useRef<{ x: number; scrubbing: boolean }>(undefined)
  const blocks = head.blocks
  const headSlot = head.head?.slot
  const limits = head.limits
  // by slot, not block: an orphaned block on show isn't on the chain any more
  const anchorSlot = block?.slot
  const anchorColumn =
    anchorSlot === undefined
      ? -1
      : blocks.findIndex((b) => b.slot === anchorSlot)
  const active = rewind.active

  const previousHead = useRef<number>(undefined)
  useEffect(() => {
    previousHead.current = headSlot
  }, [headSlot])

  const markerMoved = useOwnMove(selectedSlot, anchorColumn)

  useChainMotion(trackRef, headSlot, active)
  // the reader's orphan keeps its ghost branch up for as long as they look at it
  const uncles =
    orphaned && !rewind.uncles.includes(orphaned.reorg)
      ? [...rewind.uncles, orphaned.reorg]
      : rewind.uncles
  useFollowHead(scrollerRef, headSlot, anchorColumn, selectedSlot)

  function pick(clientX: number) {
    const track = trackRef.current
    if (!track || blocks.length === 0) return
    const column = columnAt(track, clientX)
    const slot = nearestProposed(blocks, column)?.slot
    select(slot === headSlot ? undefined : slot)
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    drag.current = { x: e.clientX, scrubbing: e.pointerType !== 'touch' }
    // a finger swipes the strip; a mouse scrubs it
    if (e.pointerType !== 'touch') {
      e.currentTarget.setPointerCapture(e.pointerId)
      pick(e.clientX)
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'touch') return
    if (drag.current?.scrubbing) pick(e.clientX)
    const track = trackRef.current
    if (track) setHover(columnAt(track, e.clientX))
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const started = drag.current
    drag.current = undefined
    if (
      e.pointerType === 'touch' &&
      started &&
      Math.abs(e.clientX - started.x) < 8
    ) {
      pick(e.clientX)
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (anchorColumn < 0) return
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      PageUp: -8,
      PageDown: 8,
      Home: -blocks.length,
      End: blocks.length,
    }
    if (e.key === 'Escape') {
      select(undefined)
      return
    }
    const by = moves[e.key]
    if (by === undefined) return
    e.preventDefault()
    const target = Math.min(blocks.length - 1, Math.max(0, anchorColumn + by))
    const slot = nearestProposed(blocks, target, Math.sign(by))?.slot
    select(slot === headSlot ? undefined : slot)
  }

  const justifiedColumn =
    head.justifiedSlot === undefined
      ? -1
      : lastIndexAtOrBefore(blocks, head.justifiedSlot)
  const finalizedColumn =
    head.finalizedSlot === undefined
      ? -1
      : lastIndexAtOrBefore(blocks, head.finalizedSlot)
  const hovered = hover !== undefined ? blocks[hover] : undefined
  const trackWidth = trackRef.current?.offsetWidth ?? 0

  return (
    <div
      ref={scrollerRef}
      className="scrollbar-none overflow-x-auto overscroll-x-contain px-4 pt-1 pb-2 md:overflow-visible md:px-5 md:pb-3"
    >
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Block shown on the page"
        aria-valuemin={blocks[0]?.slot ?? 0}
        aria-valuemax={headSlot ?? 0}
        aria-valuenow={block?.slot ?? 0}
        aria-valuetext={
          block
            ? `Block ${formatBlockNumber(block.number ?? 0)}, slot ${formatInteger(block.slot)}${selectedSlot === undefined ? ', the head' : ''}`
            : 'Connecting'
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = undefined
        }}
        onPointerLeave={() => setHover(undefined)}
        onKeyDown={onKeyDown}
        className={cn(
          'relative cursor-ew-resize touch-pan-x select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-surface-primary',
          TRACK_VARS,
          TRACK_WIDTH,
        )}
      >
        <Lane blocks={blocks} uncles={uncles} />
        {blocks.length === 0 ? (
          <SkeletonRow />
        ) : (
          <>
            {anchorColumn >= 0 && (
              <Playhead
                column={anchorColumn}
                isLive={selectedSlot === undefined}
                animated={markerMoved}
              />
            )}
            <div
              className="relative z-10 grid h-(--tile-h) gap-(--gap)"
              style={{
                gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
              }}
            >
              {blocks.map((b, i) => (
                <Tile
                  key={b.slot}
                  block={b}
                  column={i}
                  maxBlobs={limits.maxBlobs}
                  isHead={b.slot === headSlot}
                  isSelected={
                    selectedSlot !== undefined &&
                    b.slot === selectedSlot &&
                    !orphaned
                  }
                  enter={enterOf(b, active, previousHead.current)}
                />
              ))}
              <NextSlotTile
                column={blocks.length}
                nextSlotAt={head.nextSlotAt}
              />
            </div>
            <Guides
              targetBlobs={limits.targetBlobs}
              maxBlobs={limits.maxBlobs}
            />
            {uncles.map((r) => {
              const first = blocks.findIndex((b) => b.slot === r.forkSlot + 1)
              // gone once its first slot leaves the window
              if (first < 0) return null
              return (
                <UncleBranch
                  key={r.seenAt}
                  reorg={r}
                  firstColumn={first}
                  forkColumn={first - 1}
                  maxBlobs={limits.maxBlobs}
                  animate={r === active}
                  highlightSlot={orphaned?.reorg === r ? anchorSlot : undefined}
                />
              )
            })}
            {active && (
              <RewindSweepAt
                blocks={blocks}
                reorg={active}
                key={active.seenAt}
              />
            )}
            <SettledRail
              justifiedSlot={head.justifiedSlot}
              justifiedColumn={justifiedColumn}
              finalizedColumn={finalizedColumn}
              finalizedSlot={head.finalizedSlot}
            />
          </>
        )}
        {hovered && hover !== undefined && (
          <PointerTooltip
            x={((hover + 0.5) / COLUMNS) * trackWidth}
            y={trackRef.current?.offsetHeight ?? 0}
            containerWidth={trackWidth}
          >
            <TileTooltip block={hovered} isHead={hovered.slot === headSlot} />
          </PointerTooltip>
        )}
      </div>
    </div>
  )
}

function RewindSweepAt({
  blocks,
  reorg,
}: {
  blocks: HeadBlock[]
  reorg: Reorg
}) {
  const forkColumn = blocks.findIndex((b) => b.slot === reorg.forkSlot)
  if (forkColumn < 0) return null
  return <RewindSweep forkColumn={forkColumn} depth={reorg.depth} />
}

/**
 * How a tile enters: the blocks of a reorg's winning branch land one by one,
 * oldest first; a fresh head grows out of the slot being built
 */
function enterOf(
  block: HeadBlock,
  active: Reorg | undefined,
  previousHead: number | undefined,
): ComponentProps<typeof Tile>['enter'] {
  const i = active ? active.by.indexOf(block) : -1
  if (active && i >= 0) {
    return { kind: 'replacement', delay: rewindTiming(active.depth).landAt(i) }
  }
  if (previousHead !== undefined && block.slot > previousHead) {
    return { kind: 'new' }
  }
  return undefined
}

/** The lane above the chain: epoch boundaries, and room for uncles */
function Lane({ blocks, uncles }: { blocks: HeadBlock[]; uncles: Reorg[] }) {
  // a ghost branch takes the lane over its slots, so labels there step aside
  const nearUncle = (slot: number) =>
    uncles.some(
      (u) => slot > u.forkSlot - 9 && slot <= u.forkSlot + u.depth + 2,
    )
  return (
    <div className="relative h-(--lane-h)" aria-hidden>
      {blocks.map((b, i) =>
        b.slot % SLOTS_PER_EPOCH === 0 && !nearUncle(b.slot) ? (
          <div
            key={b.slot}
            className={cn(
              'absolute bottom-0 flex h-full items-start border-divider',
              // near the end of the strip the label hangs left of its tick, so it isn't cut off
              i > COLUMNS - 10
                ? '-translate-x-full border-r pr-1'
                : 'border-l pl-1',
            )}
            style={{ left: columnLeft(i) }}
          >
            <span className="whitespace-nowrap font-medium text-[10px] text-secondary tabular-nums leading-none">
              Epoch {formatInteger(epochOf(b.slot))}
            </span>
          </div>
        ) : null,
      )}
    </div>
  )
}

/**
 * The chain line threading every block, and the gas and blob targets as
 * hairlines: a tile poking past one is a block above target
 */
function Guides({
  targetBlobs,
  maxBlobs,
}: {
  targetBlobs: number
  maxBlobs: number
}) {
  const half = 'var(--tile-h) / 2 - 1px'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-20"
    >
      <div
        className="absolute h-px bg-primary/30"
        style={{
          top: 'calc(var(--lane-h) + var(--tile-h) / 2 - 0.5px)',
          left: 0,
          right: 0,
        }}
      />
      <div
        className="absolute border-primary/40 border-t border-dashed"
        style={{
          top: `calc(var(--lane-h) + (${half}) * 0.5)`,
          left: 0,
          width: columnsWidth(COLUMNS - 1),
        }}
      />
      <div
        className="absolute border-primary/40 border-t border-dashed"
        style={{
          top: `calc(var(--lane-h) + var(--tile-h) / 2 + 1px + (${half}) * ${targetBlobs / maxBlobs})`,
          left: 0,
          width: columnsWidth(COLUMNS - 1),
        }}
      />
    </div>
  )
}

/**
 * Under the chain, how settled each block is: a solid rail under justified
 * blocks, a dashed one under those that can still be reorged without anyone
 * being slashed. The boundary moves forward one epoch at a time.
 */
function SettledRail({
  justifiedSlot,
  justifiedColumn,
  finalizedColumn,
  finalizedSlot,
}: {
  justifiedSlot: number | undefined
  justifiedColumn: number
  finalizedColumn: number
  finalizedSlot: number | undefined
}) {
  const boundary = justifiedColumn >= 0 ? boundaryAfter(justifiedColumn) : '0px'
  const jumped = useOwnMove(justifiedSlot, justifiedColumn)

  const transition = jumped
    ? `left ${FOLLOW.duration * 1.6}ms ${FOLLOW.easing}, width ${FOLLOW.duration * 1.6}ms ${FOLLOW.easing}`
    : undefined
  return (
    <div className="relative h-(--rail-h)" aria-hidden>
      <div
        className="absolute top-1.5 left-0 h-[3px] rounded-full bg-primary"
        style={{ width: boundary, transition }}
      />
      <div
        className="absolute top-1.5 right-0 h-0 border-secondary/70 border-t-[3px] border-dotted"
        style={{ left: `calc(${boundary} + 4px)`, transition }}
      />
      {/* the settled line itself, cutting up through the chain at the boundary */}
      <div
        className="-translate-x-1/2 absolute bottom-[calc(100%-12px)] z-20 h-[calc(var(--tile-h)+var(--lane-h)*0.55)] w-[2px] rounded-full bg-primary"
        style={{ left: boundary, transition }}
      />
      {finalizedColumn >= 0 && (
        <div
          className="absolute top-[5px] left-0 h-[5px] rounded-full bg-primary"
          style={{ width: boundaryAfter(finalizedColumn) }}
        />
      )}
      <div className="absolute inset-x-0 top-3 flex text-[10px] leading-3 md:text-[11px]">
        <div
          className="@container flex min-w-0 shrink-0 justify-between gap-2 pr-2"
          style={{ width: boundary, transition }}
        >
          {/* only where the settled stretch has room for it; the inspector always says it */}
          <span className="@min-[15rem]:inline hidden truncate text-secondary">
            ◂ Finalized up to slot{' '}
            <span className="text-primary tabular-nums">
              {finalizedSlot !== undefined ? formatInteger(finalizedSlot) : '—'}
            </span>
          </span>
          <span className="ml-auto @min-[4.5rem]:inline hidden shrink-0 font-medium text-primary">
            Justified
          </span>
        </div>
        <span className="truncate pl-2 text-secondary">
          Not yet justified: can still be reorged
        </span>
      </div>
    </div>
  )
}

/** Marks the block the page shows: pink on the live head, blue on a block in the past */
function Playhead({
  column,
  isLive,
  animated,
}: {
  column: number
  isLive: boolean
  animated: boolean
}) {
  return (
    <div
      aria-hidden
      className="-translate-x-1/2 pointer-events-none absolute top-[calc(var(--lane-h)-9px)] bottom-[calc(var(--rail-h)-2px)] z-0 flex w-3 flex-col items-center"
      style={{
        left: columnCenter(column),
        transition: animated
          ? `left ${FOLLOW.duration}ms ${FOLLOW.easing}`
          : undefined,
      }}
    >
      <svg
        viewBox="0 0 10 6"
        className={cn('w-2.5', isLive ? 'fill-brand' : 'fill-chart-ethereum')}
      >
        <path d="M0 0h10L5 6z" />
      </svg>
      <div
        className={cn(
          'w-0.5 flex-1 rounded-full',
          isLive ? 'bg-brand/40' : 'bg-chart-ethereum',
        )}
      />
    </div>
  )
}

function TileTooltip({ block, isHead }: { block: HeadBlock; isHead: boolean }) {
  if (block.status === 'missed') {
    return (
      <div className="space-y-1">
        <div className="font-bold">
          Slot {formatInteger(block.slot)} was missed
        </div>
        <div className="text-secondary">
          Its proposer published no block, so the chain skipped it.
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-bold tabular-nums">
          {formatBlockNumber(block.number ?? 0)}
        </span>
        <span className="text-secondary text-xs tabular-nums">
          {formatBlockTime(block.timestamp)}
        </span>
      </div>
      <Row label="Slot" value={formatInteger(block.slot)} />
      <Row
        label="Gas"
        value={`${formatMillions(block.gasUsed)} · ${formatPercent(block.gasUsed / block.gasLimit)}`}
      />
      <Row label="Blobs" value={String(block.blobCount)} />
      <Row label="Base fee" value={formatGwei(block.baseFeeGwei)} />
      <div className="pt-1 text-secondary text-xs">
        {isHead
          ? 'The head. Click to follow it live'
          : 'Click to show this block across the page'}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 tabular-nums">
      <span className="text-secondary">{label}</span>
      <span>{value}</span>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div
      className="grid h-(--tile-h) gap-(--gap)"
      style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: COLUMNS }, (_, i) => (
        <div
          key={i}
          className="h-full animate-pulse rounded-[3px] bg-primary/[0.07]"
        />
      ))}
    </div>
  )
}

/**
 * Whether a marker's last move was its own, so it springs there, or the
 * chain's, so it rides the track's slide. Kept as state, not compared to a
 * ref, so a hover re-render mid-spring doesn't cut the transition.
 */
function useOwnMove<T>(cause: T, column: number) {
  const [last, setLast] = useState({ cause, column, own: false })
  if (last.cause !== cause || last.column !== column) {
    const own = last.cause !== cause
    setLast({ cause, column, own })
    return own
  }
  return last.own
}

/** Snaps to the nearest slot with a block: a missed slot has nothing to show */
function nearestProposed(blocks: HeadBlock[], column: number, prefer = 1) {
  for (let d = 0; d < blocks.length; d++) {
    for (const i of [column + d * prefer, column - d * prefer]) {
      const b = blocks[Math.min(i, blocks.length - 1)]
      if (i >= 0 && b?.status === 'proposed') return b
    }
  }
  return undefined
}

function lastIndexAtOrBefore(blocks: HeadBlock[], slot: number) {
  for (let i = blocks.length - 1; i >= 0; i--) {
    if ((blocks[i]?.slot ?? 0) <= slot) return i
  }
  return -1
}

/**
 * On a phone the strip scrolls. It starts at the head and keeps up with it
 * while the reader is there; a block picked from a link is brought into view.
 */
function useFollowHead(
  scrollerRef: React.RefObject<HTMLDivElement | null>,
  headSlot: number | undefined,
  anchorColumn: number,
  selectedSlot: number | undefined,
) {
  const atEnd = useRef(true)
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const onScroll = () => {
      atEnd.current =
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 40
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [scrollerRef])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || headSlot === undefined || !atEnd.current) return
    scroller.scrollLeft = scroller.scrollWidth
  }, [scrollerRef, headSlot])

  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new selection scrolls, not the chain moving under it
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || selectedSlot === undefined || anchorColumn < 0) return
    const x =
      ((anchorColumn + 0.5) / COLUMNS) * (scroller.scrollWidth - 32) + 16
    if (
      x < scroller.scrollLeft ||
      x > scroller.scrollLeft + scroller.clientWidth
    ) {
      scroller.scrollTo({
        left: x - scroller.clientWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [scrollerRef, selectedSlot])
}
