import { useState } from 'react'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { useEthereumHead } from '../../../live/EthereumHeadContext'
import type { DailyPoint } from '../../../live/simulatedHistory'
import { colorOf } from '../deck/BlockTape'
import {
  averageOf,
  BLOB_BYTES,
  blobLimitsAt,
  SLOT_SECONDS,
  todayRates,
  windowStats,
} from '../derive'
import { fmtNumber, fmtPercent } from '../format'
import { HistoryChart } from '../ui/HistoryChart'
import {
  Instrument,
  Panel,
  Readout,
  SectionHead,
  Segmented,
  Unit,
} from '../ui/Panel'
import { Ticker } from '../ui/Ticker'
import {
  RANGES,
  type Range,
  sliceRange,
  UPGRADE_MARKERS,
  withToday,
} from './history'

type ThroughputUnit = 'bytes' | 'blobs'
type ActivityMetric = 'tps' | 'gas'

/** How much Ethereum carries, and how close to its limits, from the forks that set them to the block that just landed */
export function Capacity({
  history,
  posterColors,
}: {
  history: DailyPoint[]
  posterColors: Map<string, string>
}) {
  const head = useEthereumHead()
  const today = head.today
  const rates = today && todayRates(today)
  return (
    <section id="throughput" className="scroll-mt-20">
      <SectionHead
        title="Capacity"
        lede="How much data and activity Ethereum carries, against the limits each upgrade set. History is daily; today's partial day is drawn dashed."
      />
      <Instrument className="md:grid-cols-12">
        <Throughput
          history={history}
          todayValue={
            rates && { bytes: rates.bytesPerSecond, blobs: rates.blobsPerBlock }
          }
          todayAt={today?.startedAt}
        />
        <LiveBlobs className="md:col-span-4" posterColors={posterColors} />
        <Activity
          history={history}
          todayValue={
            rates && {
              tps: rates.tps,
              uops: rates.uops,
              gas: rates.gasPerSecond,
            }
          }
          todayAt={today?.startedAt}
        />
      </Instrument>
    </section>
  )
}

function Throughput({
  history,
  todayValue,
  todayAt,
}: {
  history: DailyPoint[]
  todayValue: { bytes: number; blobs: number } | undefined
  todayAt: number | undefined
}) {
  const [range, setRange] = useState<Range>('1y')
  const [unit, setUnit] = useState<ThroughputUnit>('bytes')
  const points = sliceRange(history, range)
  const timestamps = withToday(points, todayValue && todayAt)
  const pick = (p: DailyPoint) =>
    unit === 'bytes' ? p.dataPerSecond / 1024 : p.avgBlobsPerBlock
  const today =
    todayValue === undefined
      ? undefined
      : unit === 'bytes'
        ? todayValue.bytes / 1024
        : todayValue.blobs
  const toUnit = (blobsPerBlock: number) =>
    unit === 'bytes'
      ? (blobsPerBlock * BLOB_BYTES) / SLOT_SECONDS / 1024
      : blobsPerBlock
  const values = [...points.map(pick), ...(today === undefined ? [] : [today])]
  const average = averageOf(history, 30, pick)
  const peak = points.reduce<DailyPoint | undefined>(
    (best, p) => (best === undefined || pick(p) > pick(best) ? p : best),
    undefined,
  )
  const limitsNow = blobLimitsAt(todayAt ?? points.at(-1)?.timestamp ?? 0)
  const unitLabel = unit === 'bytes' ? 'KiB/s' : 'blobs/block'
  const format = (v: number) => fmtNumber(v, v >= 100 ? 0 : 1)

  return (
    <Panel
      title="Data throughput"
      cadence="day"
      className="md:col-span-8"
      accessory={
        <>
          <Segmented
            label="Unit"
            options={[
              { value: 'bytes', label: 'KiB/s' },
              { value: 'blobs', label: 'blobs/blk' },
            ]}
            value={unit}
            onChange={setUnit}
          />
          <Segmented
            label="Range"
            options={RANGES}
            value={range}
            onChange={setRange}
          />
        </>
      }
    >
      <div className="grid grid-cols-2 gap-px border-divider/60 border-b bg-divider/50 sm:grid-cols-4">
        <Readout label="Today so far" cadence="blk">
          <span className="font-medium text-[17px] text-primary">
            <Ticker value={today} format={format} />
            <Unit>{unitLabel}</Unit>
          </span>
        </Readout>
        <Readout label="30-day average">
          <span className="font-medium font-mono text-[17px] text-primary tabular-nums">
            {format(average)}
            <Unit>{unitLabel}</Unit>
          </span>
        </Readout>
        <Readout
          label="Busiest day in range"
          footer={peak ? formatTimestamp(peak.timestamp) : undefined}
        >
          <span className="font-medium font-mono text-[17px] text-primary tabular-nums">
            {peak ? format(pick(peak)) : '—'}
            <Unit>{unitLabel}</Unit>
          </span>
        </Readout>
        <Readout label="Target · max now">
          <span className="font-medium font-mono text-[17px] text-primary tabular-nums">
            {format(toUnit(limitsNow.target))}
            <span className="text-secondary"> · </span>
            {format(toUnit(limitsNow.max))}
            <Unit>{unitLabel}</Unit>
          </span>
        </Readout>
      </div>
      <div className="px-3 pt-3 pb-2">
        <HistoryChart
          label={`Data throughput per day in ${unitLabel}, against the blob target and max`}
          timestamps={timestamps}
          partial={today !== undefined}
          format={format}
          height={210}
          markers={UPGRADE_MARKERS}
          series={[
            {
              key: 'max',
              label: 'Max',
              color: 'var(--secondary)',
              mark: 'step',
              values: timestamps.map((t) => toUnit(blobLimitsAt(t).max)),
            },
            {
              key: 'target',
              label: 'Target',
              color: 'var(--secondary)',
              mark: 'step',
              values: timestamps.map((t) => toUnit(blobLimitsAt(t).target)),
            },
            {
              key: 'value',
              label: unit === 'bytes' ? 'Blob data' : 'Blobs per block',
              color: 'var(--chart-ethereum)',
              mark: 'area',
              values,
            },
          ]}
        />
      </div>
    </Panel>
  )
}

/** The live blobs page in one panel: how full the last 64 blocks were, and the way to the full view */
function LiveBlobs({
  className,
  posterColors,
}: {
  className?: string
  posterColors: Map<string, string>
}) {
  const head = useEthereumHead()
  const stats = windowStats(head.blocks)
  const { targetBlobs, maxBlobs } = head.limits
  const recent = head.blocks.slice(-24)
  return (
    <Panel
      title="Blobs right now"
      cadence="blk"
      className={className}
      bodyClassName="flex flex-col gap-3 px-3 py-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-secondary">
            Blobs per block, 64 blk
          </div>
          <div className="font-medium text-[22px] text-primary leading-7">
            <Ticker
              value={head.head ? stats.blobsPerBlock : undefined}
              format={(v) => fmtNumber(v, 1)}
            />
          </div>
        </div>
        <div>
          <div className="text-[11px] text-secondary">Of the target</div>
          <div className="font-medium text-[22px] text-primary leading-7">
            <Ticker
              value={head.head ? stats.blobsPerBlock / targetBlobs : undefined}
              format={(v) => fmtPercent(v)}
            />
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-[3px]"
        aria-label="Blobs in the last 24 blocks, newest at the bottom"
      >
        {recent.map((b) => {
          const cells: string[] = []
          for (const p of b.blobs)
            for (let i = 0; i < p.blobs; i++)
              cells.push(colorOf(p.posterId, posterColors))
          return (
            <div key={`${b.slot}:${b.hash}`} className="flex h-[5px] gap-px">
              {Array.from({ length: maxBlobs }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'flex-1',
                    i === targetBlobs && 'ml-[3px]',
                    cells[i] === undefined &&
                      (i < targetBlobs
                        ? 'bg-surface-secondary'
                        : 'bg-surface-secondary/50'),
                  )}
                  style={cells[i] ? { background: cells[i] } : undefined}
                />
              ))}
            </div>
          )
        })}
      </div>
      <div className="relative h-3 font-mono text-[10px] text-secondary leading-3">
        <span className="absolute left-0">24 blocks, newest last</span>
        <span
          className="-translate-x-full absolute pr-1"
          style={{ left: `${(targetBlobs / maxBlobs) * 100}%` }}
        >
          target {targetBlobs}
        </span>
        <span className="absolute right-0">max {maxBlobs}</span>
      </div>
      <a
        href="/blobs"
        className="mt-auto flex h-8 items-center justify-center rounded-md border border-divider font-medium text-[12px] text-primary hover:bg-surface-secondary"
      >
        Open live blobs
      </a>
    </Panel>
  )
}

function Activity({
  history,
  todayValue,
  todayAt,
}: {
  history: DailyPoint[]
  todayValue: { tps: number; uops: number; gas: number } | undefined
  todayAt: number | undefined
}) {
  const [range, setRange] = useState<Range>('1y')
  const [metric, setMetric] = useState<ActivityMetric>('tps')
  const points = sliceRange(history, range)
  const timestamps = withToday(points, todayValue && todayAt)
  const partial = todayValue !== undefined && todayAt !== undefined
  const format = (v: number) => fmtNumber(v, metric === 'gas' ? 2 : 1)
  const series =
    metric === 'tps'
      ? [
          {
            key: 'uops',
            label: 'UOPS',
            color: 'var(--chart-cyan)',
            mark: 'line' as const,
            values: [
              ...points.map((p) => p.uops),
              ...(partial ? [todayValue.uops] : []),
            ],
          },
          {
            key: 'tps',
            label: 'TPS',
            color: 'var(--chart-ethereum)',
            mark: 'line' as const,
            values: [
              ...points.map((p) => p.tps),
              ...(partial ? [todayValue.tps] : []),
            ],
          },
        ]
      : [
          {
            key: 'gas',
            label: 'Mgas/s',
            color: 'var(--chart-ethereum)',
            mark: 'area' as const,
            values: [
              ...points.map((p) => p.gasPerSecond / 1e6),
              ...(partial ? [todayValue.gas / 1e6] : []),
            ],
          },
        ]
  const pick = (p: DailyPoint) =>
    metric === 'tps' ? p.tps : p.gasPerSecond / 1e6
  const today =
    todayValue && (metric === 'tps' ? todayValue.tps : todayValue.gas / 1e6)
  const unit = metric === 'tps' ? 'TPS' : 'Mgas/s'

  return (
    <Panel
      id="activity"
      title="Activity"
      cadence="day"
      className="md:col-span-12"
      accessory={
        <>
          <Segmented
            label="Metric"
            options={[
              { value: 'tps', label: 'TPS·UOPS' },
              { value: 'gas', label: 'Gas/s' },
            ]}
            value={metric}
            onChange={setMetric}
          />
          <Segmented
            label="Range"
            options={RANGES}
            value={range}
            onChange={setRange}
          />
        </>
      }
    >
      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="grid grid-cols-3 gap-px border-divider/60 bg-divider/50 max-md:border-b md:grid-cols-1 md:border-r">
          <Readout label="Today so far" cadence="blk">
            <span className="font-medium text-[17px] text-primary">
              <Ticker value={today} format={format} />
              <Unit>{unit}</Unit>
            </span>
          </Readout>
          <Readout label="30-day average">
            <span className="font-medium font-mono text-[17px] text-primary tabular-nums">
              {format(averageOf(history, 30, pick))}
              <Unit>{unit}</Unit>
            </span>
          </Readout>
          <Readout label="UOPS / TPS, 30 days">
            <span className="font-medium font-mono text-[17px] text-primary tabular-nums">
              {fmtNumber(
                averageOf(history, 30, (p) => p.uops) /
                  averageOf(history, 30, (p) => p.tps),
                2,
              )}
              ×
            </span>
          </Readout>
        </div>
        <div className="min-w-0 px-3 pt-3 pb-2">
          <HistoryChart
            label={`Ethereum ${unit} per day`}
            timestamps={timestamps}
            partial={partial}
            format={format}
            height={190}
            markers={UPGRADE_MARKERS}
            series={series}
          />
        </div>
      </div>
    </Panel>
  )
}
