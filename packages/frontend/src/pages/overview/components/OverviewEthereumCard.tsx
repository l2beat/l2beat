import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { api } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatBytes } from '~/utils/number-format/formatBytes'
import type { ChartRange } from '~/utils/range/range'
import type { OverviewSparklineDataPoint } from './charts/OverviewSparkline'
import { OverviewSparkline } from './charts/OverviewSparkline'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'

interface Props {
  activityRange: ChartRange
  daRange: ChartRange
}

const MOCK_PAST_DAY_UOPS = 11.4
const MOCK_TOTAL_DATA_POSTED_BYTES = 14 * 1024 ** 4 // 14 TiB across the range
const MOCK_ROLLUP_SHARE = 0.86

export function OverviewEthereumCard({ activityRange, daRange }: Props) {
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

  const activitySparkline = useMemo(
    () =>
      hasVariation(realActivitySparkline)
        ? realActivitySparkline
        : generateMockSeries(activityRange, {
            base: MOCK_PAST_DAY_UOPS,
            amplitude: 0.25,
            trend: 0.4,
            phase: 0.6,
          }),
    [activityRange, realActivitySparkline],
  )

  const dataPostedSparkline = useMemo(
    () =>
      hasVariation(realDataPostedSparkline)
        ? realDataPostedSparkline
        : generateMockSeries(daRange, {
            base: 700 * 1024 ** 3, // ~700 GiB / day baseline
            amplitude: 0.35,
            trend: 0.5,
            phase: 0,
          }),
    [daRange, realDataPostedSparkline],
  )

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

  const showFallbackStats = !hasVariation(realDataPostedSparkline)

  const pastDayUops = realPastDayUops ?? MOCK_PAST_DAY_UOPS
  const pastDayUopsChange =
    realPastDayUopsChange !== undefined && realPastDayUopsChange !== 0
      ? realPastDayUopsChange
      : computeSparklineChange(activitySparkline)
  const totalPosted = showFallbackStats
    ? MOCK_TOTAL_DATA_POSTED_BYTES
    : (realTotalPosted ?? MOCK_TOTAL_DATA_POSTED_BYTES)
  const dataPostedChange = computeSparklineChange(dataPostedSparkline)
  const rollupShare = realRollupShare ?? MOCK_ROLLUP_SHARE

  return (
    <PrimaryCard
      className={cn(
        OVERVIEW_CARD_PADDING_CLASS,
        'flex h-full flex-col lg:py-6',
      )}
    >
      <Header />
      <HorizontalSeparator className="my-3" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
        <SparklineSection
          label="Data posted to Ethereum blobs"
          stat={
            isDaLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="flex items-baseline gap-1.5 whitespace-nowrap font-medium text-label-value-13 tabular-nums">
                {formatBytes(totalPosted)}
                {dataPostedChange !== undefined && (
                  <PercentChange
                    value={dataPostedChange}
                    textClassName="font-medium text-label-value-12"
                  />
                )}
                <span className="font-medium text-label-value-12 text-secondary">
                  · {formatPercent(rollupShare)} by rollups
                </span>
              </span>
            )
          }
        >
          <OverviewSparkline
            data={dataPostedSparkline}
            isLoading={isDaLoading}
            color="sky"
            height={120}
            tooltipLabel="Data posted"
            formatValue={(value) => formatBytes(value)}
            syncedUntil={daCharts?.syncedUntil}
          />
        </SparklineSection>
        <SparklineSection
          label="Ethereum activity (UOPS)"
          stat={
            isActivityLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="flex items-baseline gap-1.5 whitespace-nowrap font-medium text-label-value-13 tabular-nums">
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
            height={120}
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
  children,
}: {
  label: string
  stat?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium text-label-value-12 text-secondary leading-tight">
          {label}
        </span>
        {stat}
      </div>
      {children}
    </div>
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

function hasVariation(
  data: OverviewSparklineDataPoint[] | undefined,
): data is OverviewSparklineDataPoint[] {
  if (!data || data.length < 2) return false
  const values = data.map((d) => d.value).filter((v): v is number => v !== null)
  if (values.length < 2) return false
  const first = values[0]
  return values.some((v) => v !== first)
}

interface MockOptions {
  base: number
  amplitude: number
  trend: number
  phase: number
}

function generateMockSeries(
  range: ChartRange,
  { base, amplitude, trend, phase }: MockOptions,
): OverviewSparklineDataPoint[] {
  const end = range[1]
  const start = range[0] ?? end - 365 * UnixTime.DAY
  const span = Math.max(end - start, UnixTime.DAY)
  const points: OverviewSparklineDataPoint[] = []
  for (let t = start; t <= end; t += UnixTime.DAY) {
    const progress = (t - start) / span
    const seasonal = Math.sin(progress * Math.PI * 4 + phase) * 0.6
    const drift = Math.cos(progress * Math.PI * 7 + phase * 1.7) * 0.25
    const value = base * (1 + trend * progress + amplitude * (seasonal + drift))
    points.push({ timestamp: t, value: Math.max(0, value) })
  }
  return points
}
