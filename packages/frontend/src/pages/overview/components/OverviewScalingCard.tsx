import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EM_DASH } from '~/consts/characters'
import { ChevronIcon } from '~/icons/Chevron'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { ChartRange } from '~/utils/range/range'
import type { OverviewSparklineDataPoint } from './charts/OverviewSparkline'
import { OverviewSparkline } from './charts/OverviewSparkline'
import {
  OVERVIEW_CARD_PADDING_CLASS,
  OVERVIEW_CHART_RIGHT_INSET_CLASS,
} from './overviewChartHeight'

interface Props {
  tvsRange: ChartRange
  activityRange: ChartRange
  scalingCategoryCounts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
  compactCharts?: boolean
}

interface TvsPoint {
  timestamp: number
  rollups: number | null
  validiumsAndOptimiums: number | null
  others: number | null
}

export function OverviewScalingCard({
  tvsRange,
  activityRange,
  scalingCategoryCounts,
  compactCharts = false,
}: Props) {
  const { data: tvs, isLoading: isTvsLoading } =
    api.tvs.recategorisedChart.useQuery({
      range: tvsRange,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
      filter: { type: 'layer2' },
    })

  const { data: activity, isLoading: isActivityLoading } =
    api.activity.recategorisedChart.useQuery({
      range: activityRange,
      filter: { type: 'all' },
    })

  const tvsSeriesPoints = useMemo<TvsPoint[] | undefined>(
    () =>
      tvs?.chart.map(([timestamp, rollups, validiumsAndOptimiums, others]) => ({
        timestamp,
        rollups,
        validiumsAndOptimiums,
        others,
      })),
    [tvs],
  )

  const tvsChartData = useMemo<OverviewSparklineDataPoint[] | undefined>(
    () =>
      tvsSeriesPoints?.map(
        ({ timestamp, rollups, validiumsAndOptimiums }) => {
          const hasAny = rollups !== null || validiumsAndOptimiums !== null
          const total =
            (rollups ?? 0) + (validiumsAndOptimiums ?? 0)
          return {
            timestamp,
            value: hasAny ? total : null,
            tvsBreakdown: {
              rollups,
              validiumsAndOptimiums,
            },
          }
        },
      ),
    [tvsSeriesPoints],
  )

  const tvsStats = useMemo(() => {
    if (!tvsSeriesPoints) return undefined
    const withData = tvsSeriesPoints.filter(
      (d) => d.rollups !== null || d.validiumsAndOptimiums !== null,
    )
    const first = withData.at(0)
    const last = withData.at(-1)
    if (!first || !last) return undefined
    const sumRv = (point: TvsPoint) =>
      (point.rollups ?? 0) + (point.validiumsAndOptimiums ?? 0)
    const firstTotal = sumRv(first)
    const lastTotal = sumRv(last)
    const change = firstTotal === 0 ? 0 : lastTotal / firstTotal - 1
    return { total: lastTotal, change }
  }, [tvsSeriesPoints])

  const realActivitySparkline = useMemo(
    () =>
      activity?.data.map(([timestamp, rollupsUops, vAndOUops]) => {
        const hasAny = rollupsUops !== null || vAndOUops !== null
        const sum = (rollupsUops ?? 0) + (vAndOUops ?? 0)
        return {
          timestamp,
          value: hasAny ? sum / UnixTime.DAY : null,
        }
      }),
    [activity],
  )

  const activitySparkline = realActivitySparkline

  const pastDayActivityUops = useMemo(() => {
    if (!activitySparkline) return undefined
    const last = [...activitySparkline].reverse().find((d) => d.value !== null)
    return last?.value ?? undefined
  }, [activitySparkline])

  const pastDayActivityUopsChange = useMemo(
    () => computeSparklineChange(activitySparkline),
    [activitySparkline],
  )

  const chartHeight = compactCharts ? 48 : 96

  return (
    <PrimaryCard
      className={cn(
        OVERVIEW_CARD_PADDING_CLASS,
        'flex h-full flex-col pb-4',
        compactCharts && 'xl:pt-5 xl:pb-3',
      )}
    >
      <Header counts={scalingCategoryCounts} />
      <HorizontalSeparator className={cn(compactCharts ? 'my-2' : 'my-3')} />
      <div
        className={cn(
          'grid grid-cols-1',
          compactCharts ? 'gap-3' : 'gap-3.5',
          !compactCharts && 'md:grid-cols-2 md:gap-6',
        )}
      >
        <SparklineSection
          label="Total value secured"
          compactCharts={compactCharts}
          stat={
            isTvsLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : tvsStats === undefined ? (
              <NoDataStat />
            ) : (
              <span className="flex flex-wrap items-baseline justify-end gap-x-1.5 gap-y-1 font-medium text-label-value-13 tabular-nums">
                {formatCurrency(tvsStats.total, 'usd')}
                <PercentChange
                  value={tvsStats.change}
                  textClassName="font-medium text-label-value-12"
                />
              </span>
            )
          }
        >
          <OverviewSparkline
            data={tvsChartData}
            isLoading={isTvsLoading}
            color="pink"
            height={chartHeight}
            tooltipLabel="Total value secured"
            formatValue={(value) => formatCurrency(value, 'usd')}
            syncedUntil={tvs?.syncedUntil}
          />
        </SparklineSection>
        <SparklineSection
          label="Scaling activity (UOPS)"
          compactCharts={compactCharts}
          stat={
            isActivityLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : pastDayActivityUops === undefined ? (
              <NoDataStat />
            ) : (
              <span className="flex flex-wrap items-baseline justify-end gap-x-1.5 gap-y-1 font-medium text-label-value-13 tabular-nums">
                {formatActivityCount(pastDayActivityUops)} UOPS
                {pastDayActivityUopsChange !== undefined && (
                  <PercentChange
                    value={pastDayActivityUopsChange}
                    textClassName="font-medium text-label-value-12"
                  />
                )}
              </span>
            )
          }
        >
          <OverviewSparkline
            data={activitySparkline}
            isLoading={isActivityLoading}
            color="cyan"
            height={chartHeight}
            tooltipLabel="UOPS"
            formatValue={(value) => formatActivityCount(value)}
            syncedUntil={activity?.syncedUntil}
          />
        </SparklineSection>
      </div>
    </PrimaryCard>
  )
}

function Header({
  counts,
}: {
  counts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl">Scaling</span>
        <a
          className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none"
          href="/scaling/summary"
        >
          View details
          <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
        </a>
      </div>
      <CountsLine counts={counts} />
    </div>
  )
}

function CountsLine({
  counts,
}: {
  counts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
}) {
  const items = [
    { label: 'Rollups', value: counts.rollups, dot: 'bg-pink-100' },
    {
      label: 'Validiums & Optimiums',
      value: counts.validiumsAndOptimiums,
      dot: 'bg-blue-500',
    },
  ]

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-medium text-label-value-12">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className={cn('size-2 rounded-full', item.dot)} />
          <span className="tabular-nums">{formatInteger(item.value)}</span>
          <span className="text-secondary">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}

function SparklineSection({
  label,
  stat,
  statFooter,
  compactCharts: _compactCharts,
  children,
}: {
  label: string
  stat?: ReactNode
  statFooter?: ReactNode
  compactCharts?: boolean
  children: ReactNode
}) {
  const statsColumn =
    statFooter !== undefined && statFooter !== null ? (
      <div className="flex min-w-0 shrink-0 flex-col items-end gap-0.5 text-right">
        {stat}
        {statFooter}
      </div>
    ) : (
      stat
    )

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className="flex min-w-0 flex-nowrap items-start justify-between gap-x-2">
        <span className="min-w-0 shrink font-medium text-label-value-12 text-secondary leading-tight">
          {label}
        </span>
        <div className="min-w-0 shrink-0">{statsColumn}</div>
      </div>
      <div className={cn('min-w-0', OVERVIEW_CHART_RIGHT_INSET_CLASS)}>
        {children}
      </div>
    </div>
  )
}

function NoDataStat() {
  return (
    <span className="whitespace-nowrap font-medium text-label-value-13 text-secondary">
      {EM_DASH}
    </span>
  )
}

function computeSparklineChange(
  data: OverviewSparklineDataPoint[] | undefined,
  daysAgo = 7,
): number | undefined {
  if (!data || data.length <= daysAgo) return undefined
  let lastIdx = -1
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i]?.value !== null) {
      lastIdx = i
      break
    }
  }
  if (lastIdx < 0) return undefined
  const last = data[lastIdx]?.value
  if (last === null || last === undefined) return undefined
  const refIdx = lastIdx - daysAgo
  if (refIdx < 0) return undefined
  const ref = data[refIdx]?.value
  if (ref === null || ref === undefined || ref === 0) return undefined
  return last / ref - 1
}
