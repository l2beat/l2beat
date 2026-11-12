import { memo, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { EASE_OUT_QUINT } from '~/utils/easing'
import { UNKNOWN_POSTER_ID } from '../../../live/simulatedHead'
import type { BlockLimits, HeadBlock, Reorg } from '../../../live/types'
import { blobFeeUnit, fmtBlobFee, fmtEth, fmtGwei, fmtNumber } from '../format'
import {
  type LogLine,
  REWIND_STAGGER_MS,
  type Rewind,
  usePauseKey,
} from '../live'
import { CadenceBadge } from '../ui/Panel'
import { Ticker } from '../ui/Ticker'

const TAPE_ROWS = 12
const ROW_H = 26

/**
 * The last blocks as a tape, newest on top, every row sliding down as a block
 * lands. A reorg plays as the tape rewinding: it scrolls back past the
 * replaced slot, rolls the orphan back in struck out in red, ejects it, drops
 * the replacement into its place and runs forward to the head again.
 */
export function BlockTape({
  blocks,
  limits,
  rewind,
  lastReorg,
  log,
  posterColors,
  className,
}: {
  blocks: HeadBlock[]
  limits: BlockLimits
  rewind: Rewind | undefined
  /** Marks the fork point and the rewritten rows for as long as they are on the tape */
  lastReorg: Reorg | undefined
  log: LogLine[]
  posterColors: Map<string, string>
  className?: string
}) {
  const live = [...blocks].reverse()
  const [paused, setPaused] = useState<HeadBlock[]>()
  const toggle = () => setPaused((p) => (p ? undefined : live))
  usePauseKey(toggle)

  const shown = paused ?? rewind?.snapshot ?? live
  const rows = layoutRows(shown, paused ? undefined : rewind)
  const waiting = paused ? live.findIndex((b) => b.slot === paused[0]?.slot) : 0
  const rewritten = new Set(lastReorg?.by.map((b) => b.slot))

  return (
    <div
      className={cn(
        '@container flex min-w-0 flex-col bg-surface-primary',
        className,
      )}
    >
      <div className="flex min-h-9 items-center gap-2 border-divider/60 border-b px-3">
        <h3 className="font-semibold text-[12px] text-primary">Block tape</h3>
        <CadenceBadge cadence="blk" />
        <RewindLabel rewind={paused ? undefined : rewind} />
        <button
          type="button"
          onClick={toggle}
          aria-pressed={!!paused}
          className="ml-auto flex h-6 items-center gap-1.5 rounded-[5px] border border-divider px-1.5 font-mono text-[11px] text-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-brand"
        >
          {paused ? (
            <span className="text-primary">
              Resume
              {waiting > 0 && (
                <span className="text-brand-deep"> +{waiting}</span>
              )}
            </span>
          ) : (
            'Pause'
          )}
          <kbd className="rounded-[3px] bg-surface-secondary px-1 text-[10px] leading-4">
            P
          </kbd>
        </button>
      </div>
      <TapeHeader />
      <div
        className="relative overflow-hidden"
        style={{ height: TAPE_ROWS * ROW_H }}
        aria-live="off"
      >
        {blocks.length === 0 && <TapeSkeleton />}
        {rows.map((row) => (
          <RowSlot key={row.key} index={row.index} slow={!!rewind}>
            <TapeRow
              block={row.block}
              tone={row.tone}
              order={row.order}
              isFork={row.block.slot === lastReorg?.forkSlot}
              rewritten={row.tone === 'live' && rewritten.has(row.block.slot)}
              enterFrom={row.enterFrom}
              limits={limits}
              posterColors={posterColors}
            />
          </RowSlot>
        ))}
        {rewind && rewind.phase !== 'forward' && <Scanlines />}
      </div>
      <Log lines={log} />
    </div>
  )
}

type Tone = 'live' | 'above' | 'struck' | 'ejected' | 'replacement'

interface LaidOutRow {
  key: string
  block: HeadBlock
  index: number
  tone: Tone
  /** Top to bottom among the forked rows, for staggering their strike and eject */
  order: number
  enterFrom?: HeadBlock
}

/**
 * Where each row sits for a stage of the rewind; rows only ever move by
 * transform. The forked rows are the `depth` slots after the fork point:
 * the orphans are shown in their place until ejected, then the winners
 */
function layoutRows(
  newestFirst: HeadBlock[],
  rewind: Rewind | undefined,
): LaidOutRow[] {
  const live = (block: HeadBlock, index: number): LaidOutRow => ({
    key: keyOf(block),
    block,
    index,
    tone: 'live',
    order: 0,
  })
  const newestForked = rewind?.reorg.by.at(-1)?.slot
  const at = newestFirst.findIndex((b) => b.slot === newestForked)
  if (!rewind || at === -1) {
    return newestFirst.slice(0, TAPE_ROWS + 1).map(live)
  }
  const { reorg, phase, dropped } = rewind
  const depth = reorg.by.length
  // Scrolled back to the fork point: its row on top, the orphans waiting
  // above it to roll back in. Until the run forward, newer rows stay off the top
  const shift = phase === 'forward' ? 0 : phase === 'rewind' ? at + depth : at
  const rows: LaidOutRow[] = []
  newestFirst.slice(0, TAPE_ROWS + 1 + shift).forEach((block, i) => {
    const order = i - at
    if (order < 0 || order >= depth) {
      rows.push({
        ...live(block, i - shift),
        tone: order < 0 && phase !== 'forward' ? 'above' : 'live',
      })
      return
    }
    const orphan = reorg.replaced[depth - 1 - order]
    const winner = reorg.by[depth - 1 - order]
    if (!orphan || !winner) return
    if (phase === 'rewind' || phase === 'strike' || phase === 'eject') {
      rows.push({
        // keyed apart from the winner: a slot missed on both branches is still two rows
        key: `orphan:${keyOf(orphan)}`,
        block: orphan,
        index: i - shift,
        tone:
          phase === 'rewind'
            ? 'above'
            : phase === 'strike'
              ? 'struck'
              : 'ejected',
        order,
      })
      return
    }
    // winners land oldest first: the bottom forked row drops in first
    if (phase === 'drop' && depth - order > dropped) return
    rows.push({
      key: keyOf(winner),
      block: winner,
      index: i - shift,
      tone: 'replacement',
      order,
      enterFrom: orphan.status === 'proposed' ? orphan : undefined,
    })
  })
  return rows
}

function keyOf(block: HeadBlock) {
  return `${block.slot}:${block.hash ?? 'missed'}`
}

/** Positions a row; moving between positions is the tape scrolling */
function RowSlot({
  index,
  slow,
  children,
}: {
  index: number
  slow: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="absolute inset-x-0 top-0 motion-reduce:transition-none"
      style={{
        height: ROW_H,
        transform: `translateY(${index * ROW_H}px)`,
        transition: `transform ${slow ? 600 : 520}ms ${slow ? 'cubic-bezier(0.65, 0, 0.35, 1)' : EASE_OUT_QUINT}`,
      }}
    >
      {children}
    </div>
  )
}

/** Narrow tapes (phones, tablets) keep slot, block, gas, blobs and txs; wider ones add the rest */
const COLUMNS =
  'grid h-full grid-cols-[70px_66px_32px_minmax(0,1fr)_30px] @[600px]:grid-cols-[74px_84px_84px_52px_minmax(112px,1fr)_40px_36px_56px] @[680px]:grid-cols-[74px_84px_60px_84px_52px_minmax(112px,1fr)_40px_36px_56px] items-center gap-x-1.5 px-3'

function TapeHeader() {
  return (
    <div
      className={cn(
        COLUMNS,
        'h-6 border-divider/60 border-b text-[10.5px] text-secondary',
      )}
    >
      <span>Slot</span>
      <span>Block</span>
      <span className="@[680px]:block hidden">Proposer</span>
      <span className="@[600px]:block hidden">Gas used</span>
      <span className="@[600px]:hidden text-right">Gas</span>
      <span className="@[600px]:block hidden text-right">Base fee</span>
      <span>Blobs</span>
      <span className="@[600px]:block hidden text-right">Blob fee</span>
      <span className="text-right">Txs</span>
      <span className="@[600px]:block hidden text-right">Burned</span>
    </div>
  )
}

const TapeRow = memo(function TapeRow({
  block,
  tone,
  order,
  isFork,
  rewritten,
  enterFrom,
  limits,
  posterColors,
}: {
  block: HeadBlock
  tone: Tone
  order: number
  isFork: boolean
  rewritten: boolean
  enterFrom: HeadBlock | undefined
  limits: BlockLimits
  posterColors: Map<string, string>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mountTone = useRef(tone)
  // a row mounts when its block lands: it drops in from above with a wash.
  // An orphan mounts off the top of the tape and rolls in by its position instead
  useLayoutEffect(() => {
    const row = ref.current
    if (!row || mountTone.current === 'above') return
    const wash =
      mountTone.current === 'replacement'
        ? 'color-mix(in oklab, var(--positive) 22%, transparent)'
        : 'color-mix(in oklab, var(--brand) 16%, transparent)'
    // read here, not from the hook: a row's one animation runs on mount, before the hook has its answer
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.animate(
      [
        {
          transform: still ? 'none' : `translateY(-${ROW_H}px)`,
          opacity: 0,
          backgroundColor: wash,
        },
        {
          transform: 'none',
          opacity: 1,
          offset: 0.35,
          backgroundColor: wash,
        },
        {},
      ],
      { duration: 1600, easing: 'ease-out' },
    )
  }, [])

  const missed = block.status === 'missed'
  const gasShare = block.gasUsed / block.gasLimit
  const from = enterFrom
  return (
    <div
      ref={ref}
      title={block.hash ? `${block.hash}` : 'Missed slot: no block proposed'}
      style={
        tone === 'ejected'
          ? { transitionDelay: `${order * REWIND_STAGGER_MS}ms` }
          : undefined
      }
      className={cn(
        COLUMNS,
        'relative border-divider/35 border-b font-mono text-[11.5px] text-primary tabular-nums transition-[opacity,transform,background-color] duration-[400ms]',
        missed &&
          'bg-[repeating-linear-gradient(135deg,transparent_0_5px,color-mix(in_oklab,var(--secondary)_10%,transparent)_5px_6px)] text-secondary',
        tone === 'above' && 'opacity-0',
        tone === 'struck' &&
          'bg-[color-mix(in_oklab,var(--negative)_12%,transparent)]',
        tone === 'ejected' &&
          '-translate-x-full bg-[color-mix(in_oklab,var(--negative)_12%,transparent)] opacity-0',
        tone === 'replacement' &&
          'bg-[color-mix(in_oklab,var(--positive)_10%,transparent)]',
        rewritten &&
          'shadow-[inset_2px_0_0_color-mix(in_oklab,var(--negative)_55%,transparent)]',
      )}
    >
      {isFork && <ForkMark />}
      <span className="text-secondary">{fmtNumber(block.slot)}</span>
      <span className={cn(tone === 'replacement' && 'text-positive')}>
        {missed ? (
          <span className="text-secondary">missed</span>
        ) : (
          <a
            href={`https://etherscan.io/block/${block.number}`}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            className="hover:underline"
          >
            {fmtNumber(block.number ?? 0)}
          </a>
        )}
      </span>
      <span className="@[680px]:block hidden truncate text-secondary">
        {fmtNumber(block.proposerIndex)}
      </span>
      <span className="@[600px]:flex hidden items-center gap-1.5">
        <GasBar share={gasShare} target={limits.gasTarget / limits.gasLimit} />
        <span className="w-8 text-right text-secondary">
          {missed ? '—' : `${Math.round(gasShare * 100)}%`}
        </span>
      </span>
      <span className="@[600px]:hidden text-right text-secondary">
        {missed ? '—' : `${Math.round(gasShare * 100)}%`}
      </span>
      <span className="@[600px]:block hidden text-right">
        {missed ? (
          '—'
        ) : (
          <Cell
            value={block.baseFeeGwei}
            from={from?.baseFeeGwei}
            format={fmtGwei}
          />
        )}
      </span>
      <BlobCells block={block} limits={limits} posterColors={posterColors} />
      <span className="@[600px]:block hidden text-right text-secondary">
        {missed
          ? '—'
          : fmtBlobFee(block.blobBaseFeeWei, blobFeeUnit(block.blobBaseFeeWei))}
      </span>
      <span className="text-right">
        {missed ? (
          '—'
        ) : (
          <Cell value={block.txCount} from={from?.txCount} format={fmtInt} />
        )}
      </span>
      <span className="@[600px]:block hidden text-right">
        {missed ? (
          '—'
        ) : (
          <Cell
            value={block.burnedEth}
            from={from?.burnedEth}
            format={fmtEth}
          />
        )}
      </span>
      {(tone === 'struck' || tone === 'ejected') && (
        <StrikeLine delay={order * REWIND_STAGGER_MS} />
      )}
    </div>
  )
})

/** A replacement's numbers roll from the orphan's, so the reader sees what changed */
function Cell({
  value,
  from,
  format,
}: {
  value: number
  from: number | undefined
  format: (v: number) => string
}) {
  if (from === undefined) return <>{format(value)}</>
  return <RollFrom from={from} to={value} format={format} />
}

function RollFrom({
  from,
  to,
  format,
}: {
  from: number
  to: number
  format: (v: number) => string
}) {
  const [shown, setShown] = useState(from)
  useLayoutEffect(() => {
    // one frame on the orphan's value, then the ticker rolls to the replacement's
    const frame = requestAnimationFrame(() => setShown(to))
    return () => cancelAnimationFrame(frame)
  }, [to])
  return <Ticker value={shown} format={format} className="mx-0 px-0" />
}

function GasBar({ share, target }: { share: number; target: number }) {
  return (
    <span className="relative h-2 w-10 shrink-0 overflow-hidden rounded-[2px] bg-surface-secondary">
      <span
        className={cn(
          'absolute inset-y-0 left-0 rounded-[2px]',
          share > target ? 'bg-primary/70' : 'bg-secondary/45',
        )}
        style={{ width: `${Math.min(1, share) * 100}%` }}
      />
      <span
        className="absolute inset-y-0 w-px bg-primary/60"
        style={{ left: `${target * 100}%` }}
      />
    </span>
  )
}

/** One cell per blob, in its poster's colour, against the target and the max */
function BlobCells({
  block,
  limits,
  posterColors,
}: {
  block: HeadBlock
  limits: BlockLimits
  posterColors: Map<string, string>
}) {
  const cells: string[] = []
  for (const p of block.blobs) {
    for (let i = 0; i < p.blobs; i++) {
      cells.push(colorOf(p.posterId, posterColors))
    }
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-5 text-right">
        {block.status === 'missed' ? '—' : block.blobCount}
      </span>
      <span className="flex h-2.5 items-stretch gap-px" aria-hidden>
        {Array.from({ length: limits.maxBlobs }, (_, i) => (
          <span
            key={i}
            className={cn(
              '@[600px]:w-[3px] w-[2px] rounded-[1px]',
              i === limits.targetBlobs && 'ml-[2px]',
              cells[i] === undefined && 'bg-surface-secondary',
            )}
            style={cells[i] ? { background: cells[i] } : undefined}
          />
        ))}
      </span>
    </span>
  )
}

export function colorOf(posterId: string, posterColors: Map<string, string>) {
  if (posterId === UNKNOWN_POSTER_ID) return 'var(--secondary)'
  return posterColors.get(posterId) ?? 'var(--surface-tertiary)'
}

function StrikeLine({ delay }: { delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    ref.current?.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      // after the row has rolled back into view, one row after another
      {
        duration: 380,
        delay: 320 + delay,
        easing: EASE_OUT_QUINT,
        fill: 'both',
      },
    )
  }, [delay])
  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-2 top-1/2 h-[1.5px] origin-left bg-negative"
    />
  )
}

/**
 * The last slot both branches share: a dashed rule along its top edge, where
 * the rewritten rows begin, and a notch in the gutter
 */
function ForkMark() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
      <span className="absolute inset-x-0 top-0 border-negative/70 border-t border-dashed" />
      <span className="-translate-y-1/2 absolute top-0 left-0 size-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-negative" />
      <span className="-translate-y-1/2 absolute top-0 right-2 rounded-[3px] bg-surface-primary px-1 font-mono text-[9px] text-negative leading-3">
        fork
      </span>
    </span>
  )
}

function RewindLabel({ rewind }: { rewind: Rewind | undefined }) {
  if (!rewind || rewind.phase === 'forward') return null
  const { depth, forkSlot } = rewind.reorg
  return (
    <span className="flex min-w-0 items-center gap-1.5 truncate font-mono text-[11px] text-negative">
      <span className="inline-block [animation-direction:reverse] [animation-duration:900ms] motion-safe:animate-spin">
        ⟲
      </span>
      <span className="truncate">
        <span className="max-sm:hidden">rewinding </span>
        {depth} {depth === 1 ? 'slot' : 'slots'} to fork {fmtNumber(forkSlot)}
      </span>
    </span>
  )
}

/** Tape running backwards: lines sweep up the tape while it rewinds */
function Scanlines() {
  return (
    <div
      aria-hidden
      className="fade-in pointer-events-none absolute inset-0 animate-in bg-[repeating-linear-gradient(180deg,color-mix(in_oklab,var(--negative)_7%,transparent)_0_1px,transparent_1px_4px)] duration-300"
    />
  )
}

function TapeSkeleton() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: TAPE_ROWS }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-divider/35 border-b px-3"
          style={{ height: ROW_H }}
        >
          <span className="h-2 w-14 rounded-sm bg-surface-secondary" />
          <span className="h-2 w-16 rounded-sm bg-surface-secondary" />
          <span className="h-2 flex-1 rounded-sm bg-surface-secondary/60" />
        </div>
      ))}
    </div>
  )
}

/** Shown at least; the log grows into whatever height the panels beside it leave */
const LOG_LINES = 3
const LOG_KEPT = 12

function Log({ lines }: { lines: LogLine[] }) {
  return (
    <div
      className="min-h-0 flex-1 overflow-hidden border-divider/60 border-t px-3 py-1.5 font-mono text-[10.5px] leading-[17px]"
      style={{ minHeight: LOG_LINES * 17 + 12 }}
      role="log"
      aria-label="Chain events"
    >
      {lines.length === 0 && (
        <div className="text-secondary">
          <span className="text-secondary/70">$</span> watching the head for
          reorgs, missed slots and finality…
        </div>
      )}
      {lines.slice(0, LOG_KEPT).map((line, i) => (
        <div
          key={line.id}
          className={cn(
            'flex gap-2 truncate',
            i === 0 && 'fade-in slide-in-from-top-1 animate-in duration-300',
          )}
        >
          <span className="shrink-0 text-secondary">
            {formatTimestamp(line.timestamp, { mode: 'time' })}
          </span>
          <span
            className={cn(
              'w-12 shrink-0 font-semibold',
              line.kind === 'reorg' && 'text-negative',
              line.kind === 'missed' && 'text-warning',
              line.kind === 'final' && 'text-positive',
              line.kind === 'epoch' && 'text-secondary',
              line.kind === 'live' && 'text-brand-deep',
            )}
          >
            {LOG_TAGS[line.kind]}
          </span>
          <span className="truncate text-primary">{line.text}</span>
        </div>
      ))}
    </div>
  )
}

const LOG_TAGS: Record<LogLine['kind'], string> = {
  live: 'LIVE',
  reorg: 'REORG',
  missed: 'MISSED',
  final: 'FINAL',
  epoch: 'EPOCH',
}

function fmtInt(value: number) {
  return fmtNumber(Math.round(value))
}
