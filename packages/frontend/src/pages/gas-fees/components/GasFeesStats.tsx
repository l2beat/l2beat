import { Skeleton } from '~/components/core/Skeleton'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import type { GasFeesUnit } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { FeeSplitBar } from './FeeSplitBar'
import { formatUnitValue, getPeriodLabel } from './metrics'

interface Props {
  stats: GasFeesSummary['stats'] | undefined
  range: ChartRange
  isLoading: boolean
  unit: GasFeesUnit
}

type Stat = { value: number | undefined; previous: number | undefined }

export function GasFeesStats({ stats, range, isLoading, unit }: Props) {
  const period = getPeriodLabel(range)
  const usd = unit === 'usd'
  const avg = usd ? stats?.ethereumAvgFee : stats?.ethereumGasPrice
  const base = usd ? stats?.ethereumBaseFee : stats?.ethereumBaseFeePerGas
  const priority = usd
    ? stats?.ethereumPriorityFee
    : stats?.ethereumPriorityFeePerGas
  // Before London there was no split, so over Max these cover less than the avg
  const sinceLondon = stats?.splitIsPartial ? ' since London' : ''
  const per = usd ? 'per tx' : 'per gas'
  const format = (value: number) => formatUnitValue(value, unit)
  const total = (base?.value ?? 0) + (priority?.value ?? 0)
  const share = (stat: Stat | undefined) =>
    stat?.value !== undefined && total > 0
      ? `${Math.round((stat.value / total) * 100)}%`
      : undefined

  const avgStat = (
    <StatBlock
      label={usd ? 'Ethereum avg fee per tx' : 'Ethereum avg gas price'}
      value={avg?.value}
      format={format}
      isLoading={isLoading}
      footer={<FeeChange stat={avg} period={period} />}
    />
  )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-0 sm:divide-x sm:divide-divider">
      <div className="sm:pr-5">{avgStat}</div>
      <div className="flex flex-col gap-1.5 sm:pl-5">
        <div className="flex items-start justify-between gap-4">
          <StatBlock
            label={`Base fee ${per}`}
            value={base?.value}
            format={format}
            isLoading={isLoading}
          />
          <StatBlock
            label={`Priority fee ${per}`}
            value={priority?.value}
            format={format}
            isLoading={isLoading}
            align="right"
          />
        </div>
        {isLoading || total === 0 ? (
          <Skeleton className="h-2 w-full" />
        ) : (
          <FeeSplitBar
            className="h-2"
            parts={[
              { key: 'base', value: base?.value ?? 0 },
              { key: 'priority', value: priority?.value ?? 0 },
            ]}
          />
        )}
        <div className="flex justify-between gap-4 text-2xs text-secondary leading-none">
          <span>
            <span className="font-medium text-primary tabular-nums">
              {share(base)}
            </span>{' '}
            burned{sinceLondon}
          </span>
          <span>
            <span className="font-medium text-primary tabular-nums">
              {share(priority)}
            </span>{' '}
            tips{sinceLondon}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatBlock({
  label,
  value,
  format,
  isLoading,
  bar,
  footer,
  align = 'left',
}: {
  label: string
  value: number | undefined
  format: (value: number) => string
  isLoading: boolean
  bar?: React.ReactNode
  footer?: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        align === 'right' && 'items-end text-right',
      )}
    >
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
      {bar}
      {footer && (
        <span className="text-2xs text-secondary leading-none">{footer}</span>
      )}
    </div>
  )
}

/** Lower fees read as good news: green going down, red going up */
function FeeChange({
  stat,
  period,
}: {
  stat: Stat | undefined
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
