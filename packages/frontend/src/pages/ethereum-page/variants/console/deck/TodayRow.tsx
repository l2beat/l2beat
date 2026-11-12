import { cn } from '~/utils/cn'
import type { DailyPoint } from '../../../live/simulatedHistory'
import type { TodaySoFar } from '../../../live/types'
import { averageOf, todayRates } from '../derive'
import { fmtEth, fmtNumber, fmtPercent, fmtSignedPercent } from '../format'
import { CadenceBadge } from '../ui/Panel'
import { Sparkline } from '../ui/Sparkline'
import { Ticker } from '../ui/Ticker'

const DAYS = 30

interface Metric {
  label: string
  unit: string
  today: (rates: ReturnType<typeof todayRates>) => number
  daily: (p: DailyPoint) => number
  format: (v: number) => string
}

/**
 * Today so far against the 30-day average. Everything is a rate, so a day
 * that is three hours old compares fairly with complete ones
 */
const METRICS: Metric[] = [
  {
    label: 'Blobs/block',
    unit: '',
    today: (r) => r.blobsPerBlock,
    daily: (p) => p.avgBlobsPerBlock,
    format: (v) => fmtNumber(v, 2),
  },
  {
    label: 'Blob data',
    unit: 'KiB/s',
    today: (r) => r.bytesPerSecond / 1024,
    daily: (p) => p.dataPerSecond / 1024,
    format: (v) => fmtNumber(v, 1),
  },
  {
    label: 'Transactions',
    unit: 'TPS',
    today: (r) => r.tps,
    daily: (p) => p.tps,
    format: (v) => fmtNumber(v, 1),
  },
  {
    label: 'Gas',
    unit: 'Mgas/s',
    today: (r) => r.gasPerSecond / 1e6,
    daily: (p) => p.gasPerSecond / 1e6,
    format: (v) => fmtNumber(v, 2),
  },
  {
    label: 'Burned',
    unit: 'ETH/h',
    today: (r) => r.burnedPerHour,
    daily: (p) => p.burnedEth / 24,
    format: fmtEth,
  },
  {
    label: 'Missed slots',
    unit: '',
    today: (r) => r.missedShare,
    daily: (p) => p.missedSlots / 7200,
    format: (v) => fmtPercent(v, 2),
  },
]

export function TodayRow({
  today,
  history,
  className,
}: {
  today: TodaySoFar | undefined
  history: DailyPoint[]
  className?: string
}) {
  const rates = today && todayRates(today)
  const recent = history.slice(-DAYS)
  const elapsed = today ? today.slots / 7200 : undefined
  return (
    <div
      className={cn(
        '@container flex min-w-0 flex-col bg-surface-primary',
        className,
      )}
    >
      <div className="flex min-h-9 items-center gap-2 border-divider/60 border-b px-3">
        <h3 className="font-semibold text-[12px] text-primary">
          Today so far vs 30-day average
        </h3>
        <CadenceBadge cadence="blk" />
        <span className="ml-auto font-mono text-[10.5px] text-secondary tabular-nums">
          {elapsed === undefined
            ? 'since 00:00 UTC'
            : `${fmtPercent(elapsed)} of the UTC day`}
        </span>
      </div>
      <div className="grid flex-1 @[420px]:grid-cols-3 @[640px]:grid-cols-6 grid-cols-2">
        {METRICS.map((m) => {
          const now = rates ? m.today(rates) : undefined
          const average = averageOf(history, DAYS, m.daily)
          const change =
            now === undefined || average === 0 ? undefined : now / average - 1
          return (
            <div
              key={m.label}
              className="flex min-w-0 flex-col gap-1 border-divider/40 border-r border-b px-3 py-2"
            >
              <span className="truncate text-[11px] text-secondary">
                {m.label}
                {m.unit && <span className="text-secondary/70"> {m.unit}</span>}
              </span>
              <div className="flex items-end justify-between gap-1.5">
                <Ticker
                  value={now}
                  format={m.format}
                  className="font-medium text-[15px] text-primary leading-5"
                />
                <Sparkline
                  values={[
                    ...recent.map(m.daily),
                    ...(now === undefined ? [] : [now]),
                  ]}
                  partialLast={now !== undefined}
                  width={44}
                  height={18}
                  label={`${m.label}, last ${DAYS} days and today so far`}
                />
              </div>
              <span className="flex items-baseline justify-between gap-1.5 whitespace-nowrap font-mono text-[10px] text-secondary tabular-nums">
                <span>avg {m.format(average)}</span>
                {change !== undefined && (
                  <span className="text-primary">
                    {fmtSignedPercent(change)}
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
