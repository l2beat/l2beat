import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useId } from 'react'
import { Area, AreaChart } from 'recharts'
import type { TvsChartDataPoint } from '~/components/chart/tvs/TvsChart'
import { TvsCustomTooltip } from '~/components/chart/tvs/TvsChart'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useTRPC } from '~/trpc/React'
import { MonthlyUpdateChartTimeRange } from './MonthlyUpdateChartTimeRange'
import { MarketShare } from './MonthlyUpdateMarketShare'

export function MonthlyUpdateTvsChart({
  entries,
  allL2ProjectsTvs,
  from,
  to,
}: {
  entries: ProjectId[]
  allL2ProjectsTvs: number
  from: UnixTime
  to: UnixTime
}) {
  const trpc = useTRPC()
  const id = useId()
  const { data, isLoading, isError, refetch } = useQuery(
    trpc.tvs.chart.queryOptions({
      range: [from, to],
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
      filter: {
        type: 'projects',
        projectIds: entries,
      },
    }),
  )

  const chartData: TvsChartDataPoint[] | undefined = data?.chart.map(
    ([timestamp, native, canonical, external]) => {
      const total =
        native !== null && canonical !== null && external !== null
          ? native + canonical + external
          : null
      return {
        timestamp,
        value: total,
      }
    },
  )

  const chartMeta = {
    value: {
      color: 'var(--project-primary)',
      indicatorType: { shape: 'line' },
      label: 'Total Value Secured',
    },
  } satisfies ChartMeta

  const stats = getStats(chartData, allL2ProjectsTvs)
  const timeRange = getChartTimeRangeFromData(chartData)

  return (
    <PrimaryCard className="rounded-lg! border border-divider">
      <Header
        timeRange={timeRange}
        isError={isError}
        stats={stats}
        unit={'usd'}
      />
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      >
        <AreaChart
          responsive
          data={chartData}
          className="h-44! min-h-44!"
          margin={{ top: 20 }}
        >
          <defs>
            <CustomFillGradientDef
              id={id}
              colors={{
                primary: 'var(--project-primary)',
                secondary: 'var(--project-secondary)',
              }}
            />
          </defs>
          <Area
            dataKey="value"
            fill={`url(#${id})`}
            fillOpacity={1}
            stroke="var(--project-primary)"
            isAnimationActive={false}
          />
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={{
              tickFormatter: (value: number) => formatCurrency(value, 'usd'),
            }}
            syncedUntil={data?.syncedUntil}
          />
          <ChartTooltip
            filterNull={false}
            content={<TvsCustomTooltip unit="usd" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </PrimaryCard>
  )
}

function Header({
  timeRange,
  isError,
  stats,
  unit,
}: {
  timeRange: [number, number] | undefined
  isError: boolean
  stats: { total: number; marketShare: number } | undefined
  unit: string
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">TVS</div>
        <MonthlyUpdateChartTimeRange timeRange={timeRange} isError={isError} />
      </div>
      <div className="text-right">
        {stats?.total ? (
          <div className="font-bold text-xl">
            {formatCurrency(stats?.total, unit)}
          </div>
        ) : (
          <Skeleton className="my-[5px] ml-auto h-5 w-20" />
        )}
        <MarketShare marketShare={stats?.marketShare} />
      </div>
    </div>
  )
}

function getStats(
  chartData: TvsChartDataPoint[] | undefined,
  allL2ProjectsTvs: number,
) {
  if (!chartData) {
    return undefined
  }

  const pointsWithData = chartData.filter((point) => point.value !== null) as {
    timestamp: number
    value: number
  }[]
  const last = pointsWithData.at(-1)
  if (!last) {
    return undefined
  }

  return {
    total: last.value,
    marketShare: last.value / allL2ProjectsTvs,
  }
}
