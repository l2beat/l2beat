import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EM_DASH } from '~/consts/characters'
import { ChevronIcon } from '~/icons/Chevron'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatBytes } from '~/utils/number-format/formatBytes'
import type { ChartRange } from '~/utils/range/range'
import type { OverviewSparklineDataPoint } from './charts/OverviewSparkline'
import { OverviewSparkline } from './charts/OverviewSparkline'
import { OverviewChartSection } from './OverviewChartSection'
import {
  OVERVIEW_CHART_PERIOD_LABEL,
  OVERVIEW_CHART_WIDGET_CARD_CLASS,
} from './overviewChartHeight'

interface Props {
  activityRange: ChartRange
  daRange: ChartRange
  /** Narrow column: stacked charts at smaller height. */
  compactCharts?: boolean
}

export function OverviewEthereumCard({
  activityRange,
  daRange,
  compactCharts = false,
}: Props) {
  const trpc = useTRPC()
  const { data: activity, isLoading: isActivityLoading } = useQuery(
    trpc.activity.ethereumChart.queryOptions({ range: activityRange }),
  )

  const { data: daCharts, isLoading: isDaLoading } = useQuery(
    trpc.da.projectCharts.queryOptions({
      projectId: 'ethereum',
      range: daRange,
      includeScalingOnly: false,
    }),
  )

  const realActivitySparkline = useMemo(
    () =>
      activity?.data.map(([timestamp, _txCount, uopsCount]) => ({
        timestamp,
        value: uopsCount !== null ? uopsCount / UnixTime.DAY : null,
      })),
    [activity],
  )

  const realDataPostedSparkline = useMemo(
    () =>
      daCharts?.totalChart.data.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
    [daCharts],
  )

  const activitySparkline = realActivitySparkline
  const dataPostedSparkline = realDataPostedSparkline

  const realTotalPosted = useMemo(() => {
    if (!daCharts) return undefined
    return daCharts.totalChart.data.reduce<number | undefined>(
      (acc, [, value]) => {
        if (value === null) return acc
        return (acc ?? 0) + value
      },
      undefined,
    )
  }, [daCharts])

  const realRollupShare = useMemo(() => {
    if (!daCharts) return undefined
    const lastWithValues = [...daCharts.byProjectChart.data]
      .reverse()
      .find(([, values]) => values !== null && Object.keys(values).length > 0)
    if (!lastWithValues || lastWithValues[1] === null) return undefined
    const values = lastWithValues[1]
    const total = Object.values(values).reduce((acc, value) => acc + value, 0)
    if (total === 0) return undefined
    const unknown = values.Unknown ?? 0
    const scaling = total - unknown
    return scaling / total
  }, [daCharts])

  const realPastDayUops = activity?.stats?.uops.pastDayCount ?? undefined
  const realPastDayUopsChange = activity?.stats?.uops.pastDayChange

  const pastDayUops = realPastDayUops
  const pastDayUopsChange =
    realPastDayUopsChange !== undefined
      ? realPastDayUopsChange
      : computeSparklineChange(activitySparkline)
  const totalPosted = realTotalPosted
  const dataPostedChange = computeSparklineChange(dataPostedSparkline)
  const rollupShare = realRollupShare

  const chartHeight = compactCharts ? 'fill' : 96

  return (
    <PrimaryCard
      className={cn(
        OVERVIEW_CHART_WIDGET_CARD_CLASS,
        'flex h-full flex-col',
        !compactCharts && 'lg:py-6',
      )}
    >
      <Header />
      <HorizontalSeparator className={cn(compactCharts ? 'my-3' : 'my-4')} />
      <div
        className={cn(
          'grid grid-cols-1',
          compactCharts
            ? 'gap-5 md:grid-cols-2 md:gap-4 xl:min-h-0 xl:flex-1 xl:auto-rows-fr xl:grid-cols-1 xl:gap-5'
            : 'gap-3.5 md:grid-cols-2 md:gap-6',
        )}
      >
        <OverviewChartSection
          label="Data posted to Ethereum blobs"
          fill={compactCharts}
          periodLabel={OVERVIEW_CHART_PERIOD_LABEL}
          stat={
            isDaLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : totalPosted === undefined ? (
              <NoDataStat />
            ) : (
              <span className="flex flex-wrap items-baseline justify-end gap-x-1.5 gap-y-1 font-medium text-label-value-13 tabular-nums">
                {formatBytes(totalPosted)}
                {dataPostedChange !== undefined && (
                  <PercentChange
                    value={dataPostedChange}
                    textClassName="font-medium text-label-value-12"
                  />
                )}
              </span>
            )
          }
          statFooter={
            !isDaLoading && rollupShare !== undefined ? (
              <span className="font-medium text-label-value-12 text-secondary tabular-nums">
                {formatPercent(rollupShare)} by rollups
              </span>
            ) : null
          }
        >
          <OverviewSparkline
            data={dataPostedSparkline}
            isLoading={isDaLoading}
            color="sky"
            height={chartHeight}
            showYAxis
            tooltipLabel="Data posted"
            formatValue={(value) => formatBytes(value)}
            syncedUntil={daCharts?.syncedUntil}
          />
        </OverviewChartSection>
        <OverviewChartSection
          label="Ethereum activity (UOPS)"
          fill={compactCharts}
          periodLabel={OVERVIEW_CHART_PERIOD_LABEL}
          stat={
            isActivityLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : pastDayUops === undefined ? (
              <NoDataStat />
            ) : (
              <span className="flex flex-wrap items-baseline justify-end gap-x-1.5 gap-y-1 font-medium text-label-value-13 tabular-nums">
                {formatActivityCount(pastDayUops)} UOPS
                {pastDayUopsChange !== undefined && (
                  <PercentChange
                    value={pastDayUopsChange}
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
            color="purple"
            height={chartHeight}
            showYAxis
            tooltipLabel="UOPS"
            formatValue={(value) => formatActivityCount(value)}
            syncedUntil={activity?.syncedUntil}
          />
        </OverviewChartSection>
      </div>
    </PrimaryCard>
  )
}

function Header() {
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold text-xl">Ethereum</span>
      <a
        className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none"
        href="/scaling/activity"
      >
        View details
        <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
      </a>
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
