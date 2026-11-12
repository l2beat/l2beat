import { useMemo, useState } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { DailyPoint } from '../../../live/simulatedHistory'
import type { EthereumHead, HeadBlock } from '../../../live/types'
import { formatBytes, formatCompact, formatRate, formatWhole } from '../format'
import {
  average,
  BLOB_BYTES,
  blobTargetAt,
  type Poster,
  type RangeId,
  SLOT_SECONDS,
  sliceRange,
  type WindowStats,
} from '../model'
import { ACTIVITY_ANCHOR, THROUGHPUT_ANCHOR } from './anchors'
import { HistoryChart } from './HistoryChart'
import { ChartBlock, LiveStat, RangeTabs, SectionShell } from './SectionShell'

/** Blocks the strip shows: enough to see bursts, few enough to read each one */
const STRIP_BLOCKS = 32

export function CapacitySection({
  live,
  stats,
  history,
  posters,
}: {
  live: EthereumHead
  stats: WindowStats
  history: DailyPoint[]
  posters: Map<string, Poster>
}) {
  const [range, setRange] = useState<RangeId>('1y')
  const { head, limits, today } = live
  const ready = head !== undefined
  const proposed = head?.status === 'proposed' ? head : undefined
  const shown = useMemo(() => sliceRange(history, range), [history, range])

  const blobPoints = useMemo(
    () => shown.map((d) => ({ t: d.timestamp, v: d.avgBlobsPerBlock })),
    [shown],
  )
  const targetPoints = useMemo(
    () =>
      shown.map((d) => ({
        t: d.timestamp,
        v: blobTargetAt(d.timestamp).target,
      })),
    [shown],
  )
  const tpsPoints = useMemo(
    () => shown.map((d) => ({ t: d.timestamp, v: d.tps })),
    [shown],
  )
  const todaySeconds = today ? Math.max(1, today.slots * SLOT_SECONDS) : 1
  const todayBlobs =
    today && today.blocks > 0
      ? {
          t: today.startedAt,
          v: today.blobs / today.blocks,
          until: today.startedAt + todaySeconds,
        }
      : undefined
  const todayTps = today
    ? {
        t: today.startedAt,
        v: today.txs / todaySeconds,
        until: today.startedAt + todaySeconds,
      }
    : undefined

  const last30 = history.slice(-30)
  const maxBytesPerSecond = (limits.maxBlobs * BLOB_BYTES) / SLOT_SECONDS

  return (
    <SectionShell
      id={THROUGHPUT_ANCHOR}
      order={1}
      title="Room left for them"
      lede="Every system in orbit shares the same blob space and block gas. This is how much of it the head block used, how full blocks have run since, and where the ceiling is."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="flex flex-col gap-6">
          <RoomMeter
            title="Blob space"
            ready={ready}
            left={Math.max(0, limits.maxBlobs - (head?.blobCount ?? 0))}
            unitLeft="blobs of room"
            used={head?.blobCount ?? 0}
            max={limits.maxBlobs}
            target={limits.targetBlobs}
            note={
              (head?.blobCount ?? 0) > limits.targetBlobs
                ? 'Over target: the blob fee rises next block'
                : 'At or under target: the blob fee holds or falls'
            }
            cells={blobCells(head, posters, limits.maxBlobs)}
          />
          <RoomMeter
            title="Block gas"
            ready={ready}
            left={Math.max(0, limits.gasLimit - (proposed?.gasUsed ?? 0))}
            unitLeft="gas of room"
            used={proposed?.gasUsed ?? 0}
            max={limits.gasLimit}
            target={limits.gasTarget}
            note={
              (proposed?.gasUsed ?? 0) > limits.gasTarget
                ? 'Over target: the base fee rises next block'
                : 'Under target: the base fee falls next block'
            }
            format={formatCompact}
          />
        </div>
        <LiveStrip
          blocks={live.blocks}
          posters={posters}
          maxBlobs={limits.maxBlobs}
          targetBlobs={limits.targetBlobs}
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 border-divider border-t pt-6 md:grid-cols-4">
        <LiveStat
          label="Data throughput"
          ready={ready}
          value={
            <RollingNumber
              value={stats.bytesPerSecond}
              format={perSecondBytes}
            />
          }
          unit="/s"
          detail={`Ceiling ${formatBytes(maxBytesPerSecond)}/s`}
          cadence="64-slot average, per block"
        />
        <LiveStat
          label="Blobs per block"
          ready={ready}
          value={
            <RollingNumber value={stats.avgBlobsPerBlock} format={oneDecimal} />
          }
          detail={`Target ${limits.targetBlobs}, max ${limits.maxBlobs}`}
          cadence="64-slot average, per block"
        />
        <LiveStat
          label="Gas per second"
          ready={ready}
          value={
            <RollingNumber
              value={stats.gasPerSecond / 1e6}
              format={oneDecimal}
            />
          }
          unit="Mgas/s"
          detail={`Target ${formatRate(limits.gasTarget / SLOT_SECONDS / 1e6)} Mgas/s`}
          cadence="64-slot average, per block"
        />
        <LiveStat
          label="Transactions"
          ready={ready}
          value={<RollingNumber value={stats.tps} format={formatRate} />}
          unit="TPS"
          detail={`${formatRate(stats.uops)} UOPS`}
          cadence="64-slot average, per block"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <RangeTabs value={range} onChange={setRange} label="History range" />
      </div>
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <ChartBlock
          title="Blobs per block, daily average"
          summary={`Last 30 complete days: ${formatRate(average(last30.map((d) => d.avgBlobsPerBlock)))}`}
        >
          <HistoryChart
            label="Average blobs per block per day, with the target"
            points={blobPoints}
            today={todayBlobs}
            reference={{ label: 'Target', points: targetPoints }}
            format={formatRate}
            color="var(--brand)"
          />
        </ChartBlock>
        <ChartBlock
          id={ACTIVITY_ANCHOR}
          title="Transactions per second, daily"
          summary={`Last 30 complete days: ${formatRate(average(last30.map((d) => d.tps)))} TPS`}
        >
          <HistoryChart
            label="Ethereum transactions per second per day"
            points={tpsPoints}
            today={todayTps}
            format={formatRate}
            color="var(--chart-ethereum)"
          />
        </ChartBlock>
      </div>
      <p className="mt-4 text-label-value-12 text-secondary">
        The hollow point is today so far, still counting. Averages use complete
        days only.
      </p>
    </SectionShell>
  )
}

interface Cell {
  color: string
  posterId: string
}

function blobCells(
  head: HeadBlock | undefined,
  posters: Map<string, Poster>,
  max: number,
): Cell[] {
  const cells: Cell[] = []
  for (const { posterId, blobs } of head?.blobs ?? []) {
    const color = posters.get(posterId)?.color ?? '#8a909d'
    for (let i = 0; i < blobs && cells.length < max; i++) {
      cells.push({ color, posterId })
    }
  }
  return cells
}

function RoomMeter({
  title,
  ready,
  left,
  unitLeft,
  used,
  max,
  target,
  note,
  cells,
  format = formatWhole,
}: {
  title: string
  ready: boolean
  left: number
  unitLeft: string
  used: number
  max: number
  target: number
  note: string
  cells?: Cell[]
  format?: (value: number) => string
}) {
  const targetAt = `${(target / max) * 100}%`
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-bold text-heading-16">{title}</h3>
        <span className="text-label-value-12 text-secondary">per block</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-bold text-heading-32 tabular-nums">
          {ready ? <RollingNumber value={left} format={format} /> : '—'}
        </span>
        <span className="text-label-value-15 text-secondary">{unitLeft}</span>
      </div>
      <div className="relative mt-3">
        {cells ? (
          <div
            className="grid h-6 gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: max }, (_, i) => {
              const cell = cells[i]
              return (
                <span
                  key={i}
                  className={cn(
                    'rounded-[3px] transition-colors duration-500',
                    !cell && 'bg-surface-secondary',
                  )}
                  style={cell ? { backgroundColor: cell.color } : undefined}
                />
              )
            })}
          </div>
        ) : (
          <div className="h-6 overflow-hidden rounded-[4px] bg-surface-secondary">
            <div
              className="h-full origin-left rounded-[4px] bg-(--chart-ethereum) transition-transform duration-700 ease-out"
              style={{ transform: `scaleX(${Math.min(1, used / max)})` }}
            />
          </div>
        )}
        <span
          aria-hidden
          className="-top-1.5 -bottom-1.5 absolute w-[2px] rounded bg-primary"
          style={{ left: `calc(${targetAt} - 1px)` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-label-value-12 text-secondary tabular-nums">
        <span>
          {format(used)} used, target {format(target)}
        </span>
        <span>max {format(max)}</span>
      </div>
      <p className="mt-2 text-label-value-13">{ready ? note : ''}</p>
    </div>
  )
}

/** The last blocks as columns, colored by who posted: a glance at /blobs, which has the full picture */
function LiveStrip({
  blocks,
  posters,
  maxBlobs,
  targetBlobs,
}: {
  blocks: HeadBlock[]
  posters: Map<string, Poster>
  maxBlobs: number
  targetBlobs: number
}) {
  const shown = blocks.slice(-STRIP_BLOCKS)
  const height = 168
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-bold text-heading-16">
          Blobs in the last {STRIP_BLOCKS} slots
        </h3>
        <a
          href="/blobs"
          className="shrink-0 font-medium text-label-value-13 text-link underline"
        >
          Open live blobs
        </a>
      </div>
      <div
        className="relative mt-4 flex items-end gap-[3px]"
        style={{ height }}
        aria-label={`Blobs per block for the last ${STRIP_BLOCKS} slots`}
        role="img"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 border-primary/60 border-t border-dashed"
          style={{ bottom: (targetBlobs / maxBlobs) * height }}
        >
          <span className="-top-4 absolute right-0 bg-surface-primary pl-1 text-[11px] text-secondary">
            target {targetBlobs}
          </span>
        </span>
        {shown.length === 0 &&
          Array.from({ length: STRIP_BLOCKS }, (_, i) => (
            <span
              key={i}
              className="h-1 flex-1 rounded-sm bg-surface-secondary"
            />
          ))}
        {shown.map((block, index) => (
          <span
            key={`${block.slot}:${block.hash ?? 'missed'}`}
            title={
              block.status === 'missed'
                ? `Slot ${formatWhole(block.slot)}: missed`
                : `Block ${formatWhole(block.number ?? 0)}: ${block.blobCount} blobs`
            }
            className={cn(
              'flex min-w-0 flex-1 flex-col-reverse gap-px overflow-hidden rounded-t-[3px]',
              index === shown.length - 1 &&
                'fade-in-0 slide-in-from-bottom-2 animate-in duration-500',
            )}
            style={{
              height: Math.max(3, (block.blobCount / maxBlobs) * height),
            }}
          >
            {block.status === 'missed' ? (
              <span className="h-[3px] w-full rounded-sm bg-negative/50" />
            ) : (
              block.blobs.map((b) => (
                <span
                  key={b.posterId}
                  className="w-full"
                  style={{
                    flexGrow: b.blobs,
                    backgroundColor:
                      posters.get(b.posterId)?.color ?? '#8a909d',
                  }}
                />
              ))
            )}
          </span>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-label-value-12 text-secondary">
        <span>{(STRIP_BLOCKS * SLOT_SECONDS) / 60} min ago</span>
        <span>head</span>
      </div>
    </div>
  )
}

function perSecondBytes(value: number) {
  return formatBytes(value)
}

function oneDecimal(value: number) {
  return value.toFixed(1)
}
