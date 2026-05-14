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
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatBytes } from '~/utils/number-format/formatBytes'
import type { ChartRange } from '~/utils/range/range'
import type { OverviewSparklineDataPoint } from './charts/OverviewSparkline'
import { OverviewSparkline } from './charts/OverviewSparkline'
import {
  OVERVIEW_CARD_PADDING_CLASS,
  OVERVIEW_CHART_RIGHT_INSET_CLASS,
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
  const { data: activity, isLoading: isActivityLoading } =
    api.activity.ethereumChart.useQuery({ range: activityRange })

  const { data: daCharts, isLoading: isDaLoading } =
    api.da.projectCharts.useQuery({
      projectId: 'ethereum',
      range: daRange,
      includeScalingOnly: false,
    })

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

  const chartHeight = compactCharts ? 48 : 96

  return (
    <PrimaryCard
      className={cn(
        OVERVIEW_CARD_PADDING_CLASS,
        'flex h-full flex-col pb-4',
        compactCharts && 'xl:pt-5 xl:pb-3',
        !compactCharts && 'lg:py-6',
      )}
    >
      <Header />
      <HorizontalSeparator className={cn(compactCharts ? 'my-2' : 'my-3')} />
      <div
        className={cn(
          'grid grid-cols-1',
          compactCharts ? 'gap-3' : 'gap-3.5',
          !compactCharts && 'md:grid-cols-2 md:gap-6',
        )}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex min-w-0 items-start gap-2">
            <span className="min-w-0 flex-1 font-medium text-label-value-12 text-secondary leading-tight">
              Data posted to Ethereum blobs
            </span>
            <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
              {isDaLoading ? (
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
              )}
              {!isDaLoading && rollupShare !== undefined ? (
                <span className="font-medium text-label-value-12 text-secondary tabular-nums">
                  {formatPercent(rollupShare)} by rollups
                </span>
              ) : null}
            </div>
          </div>
          <div className={cn('min-w-0', OVERVIEW_CHART_RIGHT_INSET_CLASS)}>
            <OverviewSparkline
              data={dataPostedSparkline}
              isLoading={isDaLoading}
              color="sky"
              height={chartHeight}
              tooltipLabel="Data posted"
              formatValue={(value) => formatBytes(value)}
              syncedUntil={daCharts?.syncedUntil}
            />
          </div>
        </div>
        <SparklineSection
          label="Ethereum activity (UOPS)"
          compactCharts={compactCharts}
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
            tooltipLabel="UOPS"
            formatValue={(value) => formatActivityCount(value)}
            syncedUntil={activity?.syncedUntil}
          />
        </SparklineSection>
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

function SparklineSection({
  label,
  stat,
  statFooter,
  compactCharts: _compact,
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
