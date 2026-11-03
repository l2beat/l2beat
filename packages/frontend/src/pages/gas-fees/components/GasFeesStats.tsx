import { Skeleton } from '~/components/core/Skeleton'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { formatFee, formatTimes, getPeriodLabel } from './metrics'

interface Props {
  stats: GasFeesSummary['stats'] | undefined
  range: ChartRange
  isLoading: boolean
}

export function GasFeesStats({ stats, range, isLoading }: Props) {
  const period = getPeriodLabel(range)
  // Before London there was no split, so over Max these cover less than the avg
  const sinceLondon = stats?.splitIsPartial ? ' since London' : ''
  return (
    <div className="grid grid-cols-2 gap-y-4 xl:grid-cols-4 xl:divide-x xl:divide-divider">
      <Stat
        label="Ethereum avg fee per tx"
        value={stats?.ethereumAvgFee.value}
        format={formatFee}
        isLoading={isLoading}
        footer={<FeeChange stat={stats?.ethereumAvgFee} period={period} />}
      />
      <Stat
        label="Base fee per tx"
        value={stats?.ethereumBaseFee.value}
        format={formatFee}
        isLoading={isLoading}
        footer={
          <Share
            part={stats?.ethereumBaseFee.value}
            stats={stats}
            note={`burned${sinceLondon}`}
          />
        }
      />
      <Stat
        label="Priority fee per tx"
        value={stats?.ethereumPriorityFee.value}
        format={formatFee}
        isLoading={isLoading}
        footer={
          <Share
            part={stats?.ethereumPriorityFee.value}
            stats={stats}
            note={`tips${sinceLondon}`}
          />
        }
      />
      <Stat
        label="L2s are cheaper by"
        value={stats?.l2sCheaperBy.value}
        format={formatTimes}
        isLoading={isLoading}
        footer={
          stats?.l2sCheaperBy.previous !== undefined
            ? `${formatTimes(stats.l2sCheaperBy.previous)} in prev. period`
            : `Median L2, ${period}`
        }
      />
    </div>
  )
}

function Stat({
  label,
  value,
  format,
  isLoading,
  footer,
}: {
  label: string
  value: number | undefined
  format: (value: number) => string
  isLoading: boolean
  footer: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 xl:px-5 xl:last:pr-0 xl:first:pl-0">
      <span className="font-medium text-2xs text-secondary uppercase leading-none">
        {label}
      </span>
      {isLoading || value === undefined ? (
        <Skeleton className="h-6 w-24" />
      ) : (
        <span className="font-bold text-xl tabular-nums leading-none">
          {format(value)}
        </span>
      )}
      <span className="text-2xs text-secondary leading-none">{footer}</span>
    </div>
  )
}

/** The part's share of base + priority, which the two stats split */
function Share({
  part,
  stats,
  note,
}: {
  part: number | undefined
  stats: GasFeesSummary['stats'] | undefined
  note: string
}) {
  const base = stats?.ethereumBaseFee.value
  const priority = stats?.ethereumPriorityFee.value
  if (part === undefined || base === undefined || priority === undefined) {
    return <>{note}</>
  }
  return (
    <>
      <span className="font-medium text-primary tabular-nums">
        {Math.round((part / (base + priority)) * 100)}%
      </span>{' '}
      {note}
    </>
  )
}

/** Lower fees read as good news: green going down, red going up */
function FeeChange({
  stat,
  period,
}: {
  stat: { value: number | undefined; previous: number | undefined } | undefined
  period: string
}) {
  if (stat?.value === undefined || stat.previous === undefined) {
    return <>{period}</>
  }
  const change = stat.value / stat.previous - 1
  return (
    <>
      <span
        className={cn(
          'font-medium tabular-nums',
          change < 0 ? 'text-positive' : 'text-negative',
        )}
      >
        {change < 0 ? '▼' : '▲'} {Math.abs(change * 100).toFixed(1)}%
      </span>{' '}
      vs prev. period
    </>
  )
}
