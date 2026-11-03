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
  return (
    <div className="grid grid-cols-2 gap-y-4 xl:grid-cols-4 xl:divide-x xl:divide-divider">
      <Stat
        label="Ethereum avg fee"
        value={stats?.ethereumAvgFee.value}
        format={formatFee}
        isLoading={isLoading}
        footer={
          <FeeChange
            value={stats?.ethereumAvgFee.value}
            previous={stats?.ethereumAvgFee.previous}
            period={period}
          />
        }
      />
      <Stat
        label="Typical L2 avg fee"
        value={stats?.typicalL2AvgFee.value}
        format={formatFee}
        isLoading={isLoading}
        footer={
          <FeeChange
            value={stats?.typicalL2AvgFee.value}
            previous={stats?.typicalL2AvgFee.previous}
            period={period}
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
      <Stat
        label="Fees paid, all chains"
        value={stats?.totalFees.value}
        format={formatFee}
        isLoading={isLoading}
        footer={
          stats && (
            <>
              <FeeChange
                value={stats.totalFees.value}
                previous={stats.totalFees.previous}
                period={period}
              />
              {` · L2s ${Math.round(stats.totalFees.l2Share * 100)}%`}
            </>
          )
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

/** Lower fees read as good news: green going down, red going up */
function FeeChange({
  value,
  previous,
  period,
}: {
  value: number | undefined
  previous: number | undefined
  period: string
}) {
  if (value === undefined || previous === undefined) return <>{period}</>
  const change = value / previous - 1
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
      vs prev.
    </>
  )
}
