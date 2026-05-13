import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { ChartRange } from '~/utils/range/range'
import type { OverviewSparklineDataPoint } from './charts/OverviewSparkline'
import { OverviewSparkline } from './charts/OverviewSparkline'
import type { StackedSparklinePoint } from './charts/OverviewStackedSparkline'
import { OverviewStackedSparkline } from './charts/OverviewStackedSparkline'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'

interface Props {
  tvsRange: ChartRange
  activityRange: ChartRange
  scalingCategoryCounts: {
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }
}

interface TvsStackedPoint extends StackedSparklinePoint {
  rollups: number | null
  validiumsAndOptimiums: number | null
  others: number | null
}

const TVS_SERIES = [
  {
    dataKey: 'rollups',
    label: 'Rollups',
    color: 'pink',
  },
  {
    dataKey: 'validiumsAndOptimiums',
    label: 'Validiums & Optimiums',
    color: 'cyan',
  },
  {
    dataKey: 'others',
    label: 'Others',
    color: 'yellow',
  },
] as const

const MOCK_TVS_BASE = {
  rollups: 38e9,
  validiumsAndOptimiums: 8e9,
  others: 2e9,
}
const MOCK_ACTIVITY_UOPS = 240

export function OverviewScalingCard({
  tvsRange,
  activityRange,
  scalingCategoryCounts,
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

  const realTvsStackedData = useMemo<TvsStackedPoint[] | undefined>(
    () =>
      tvs?.chart.map(([timestamp, rollups, validiumsAndOptimiums, others]) => ({
        timestamp,
        rollups,
        validiumsAndOptimiums,
        others,
      })),
    [tvs],
  )

  const tvsStackedData = useMemo<TvsStackedPoint[]>(
    () =>
      hasStackedVariation(realTvsStackedData)
        ? realTvsStackedData
        : generateMockStackedSeries(tvsRange, MOCK_TVS_BASE),
    [tvsRange, realTvsStackedData],
  )

  const tvsStats = useMemo(() => {
    const withData = tvsStackedData.filter(
      (d) =>
        d.rollups !== null ||
        d.validiumsAndOptimiums !== null ||
        d.others !== null,
    )
    const first = withData.at(0)
    const last = withData.at(-1)
    if (!first || !last) return undefined
    const sum = (point: TvsStackedPoint) =>
      (point.rollups ?? 0) +
      (point.validiumsAndOptimiums ?? 0) +
      (point.others ?? 0)
    const firstTotal = sum(first)
    const lastTotal = sum(last)
    const change = firstTotal === 0 ? 0 : lastTotal / firstTotal - 1
    return { total: lastTotal, change }
  }, [tvsStackedData])

  const realActivitySparkline = useMemo(
    () =>
      activity?.data.map(([timestamp, rollupsUops, vAndOUops, othersUops]) => {
        const hasAny =
          rollupsUops !== null || vAndOUops !== null || othersUops !== null
        const sum = (rollupsUops ?? 0) + (vAndOUops ?? 0) + (othersUops ?? 0)
        return {
          timestamp,
          value: hasAny ? sum / UnixTime.DAY : null,
        }
      }),
    [activity],
  )

  const activitySparkline = useMemo(
    () =>
      hasVariation(realActivitySparkline)
        ? realActivitySparkline
        : generateMockSparkline(activityRange, {
            base: MOCK_ACTIVITY_UOPS,
            amplitude: 0.3,
            trend: 0.6,
            phase: 0.4,
          }),
    [activityRange, realActivitySparkline],
  )

  const pastDayActivityUops = useMemo(() => {
    if (!activitySparkline) return undefined
    const last = [...activitySparkline]
      .reverse()
      .find((d) => d.value !== null)
    return last?.value ?? undefined
  }, [activitySparkline])

  const pastDayActivityUopsChange = useMemo(
    () => computeSparklineChange(activitySparkline),
    [activitySparkline],
  )

  return (
    <PrimaryCard
      className={cn(OVERVIEW_CARD_PADDING_CLASS, 'flex h-full flex-col')}
    >
      <Header counts={scalingCategoryCounts} />
      <HorizontalSeparator className="my-3" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
        <SparklineSection
          label="Total value secured"
          stat={
            tvsStats === undefined || isTvsLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <span className="flex items-baseline gap-1.5 whitespace-nowrap font-medium text-label-value-13 tabular-nums">
                {formatCurrency(tvsStats.total, 'usd')}
                <PercentChange
                  value={tvsStats.change}
                  textClassName="font-medium text-label-value-12"
                />
              </span>
            )
          }
        >
          <OverviewStackedSparkline
            data={tvsStackedData}
            isLoading={isTvsLoading}
            series={[...TVS_SERIES]}
            height={120}
            formatValue={(value) => formatCurrency(value, 'usd')}
            syncedUntil={tvs?.syncedUntil}
          />
        </SparklineSection>
        <SparklineSection
          label="Scaling activity (UOPS)"
          stat={
            isActivityLoading || pastDayActivityUops === undefined ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="flex items-baseline gap-1.5 whitespace-nowrap font-medium text-label-value-13 tabular-nums">
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
      label: 'V&O',
      value: counts.validiumsAndOptimiums,
      dot: 'bg-blue-500',
    },
    { label: 'Others', value: counts.others, dot: 'bg-gray-450' },
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

function hasStackedVariation(
  data: TvsStackedPoint[] | undefined,
): data is TvsStackedPoint[] {
  if (!data || data.length < 2) return false
  for (const key of ['rollups', 'validiumsAndOptimiums', 'others'] as const) {
    const values = data
      .map((d) => d[key])
      .filter((v): v is number => v !== null)
    if (values.length >= 2 && values.some((v) => v !== values[0])) {
      return true
    }
  }
  return false
}

interface MockOptions {
  base: number
  amplitude: number
  trend: number
  phase: number
}

function generateMockSparkline(
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

const SERIES_PROFILES: Record<
  keyof typeof MOCK_TVS_BASE,
  Omit<MockOptions, 'base'>
> = {
  rollups: { amplitude: 0.18, trend: 0.55, phase: 0 },
  validiumsAndOptimiums: { amplitude: 0.22, trend: 0.85, phase: 1.4 },
  others: { amplitude: 0.3, trend: -0.1, phase: 2.6 },
}

function generateMockStackedSeries(
  range: ChartRange,
  bases: typeof MOCK_TVS_BASE,
): TvsStackedPoint[] {
  const end = range[1]
  const start = range[0] ?? end - 365 * UnixTime.DAY
  const span = Math.max(end - start, UnixTime.DAY)
  const points: TvsStackedPoint[] = []
  for (let t = start; t <= end; t += UnixTime.DAY) {
    const progress = (t - start) / span
    const valueFor = (key: keyof typeof bases) => {
      const { amplitude, trend, phase } = SERIES_PROFILES[key]
      const seasonal = Math.sin(progress * Math.PI * 4 + phase) * 0.6
      const drift = Math.cos(progress * Math.PI * 7 + phase * 1.7) * 0.25
      const value =
        bases[key] * (1 + trend * progress + amplitude * (seasonal + drift))
      return Math.max(0, value)
    }
    points.push({
      timestamp: t,
      rollups: valueFor('rollups'),
      validiumsAndOptimiums: valueFor('validiumsAndOptimiums'),
      others: valueFor('others'),
    })
  }
  return points
}
