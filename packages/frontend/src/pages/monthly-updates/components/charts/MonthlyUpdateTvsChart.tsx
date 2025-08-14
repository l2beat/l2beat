import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
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
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemChartTimeRange } from '~/pages/ecosystems/project/components/charts/EcosystemsChartTimeRange'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { MarketShare } from './MonthlyUpdateMarketShare'

export function MonthlyUpdateTvsChart({
  type,
  entries,
  allScalingProjectsTvs,
  from,
  to,
}: {
  type: 'ecosystem' | 'daLayer'
  entries: ProjectId[]
  allScalingProjectsTvs: number
  from: UnixTime
  to: UnixTime
}) {
  const id = useId()
  const { data, isLoading } = api.tvs.chart.useQuery({
    range: {
      type: 'custom',
      from,
      to,
    },
    excludeAssociatedTokens: false,
    filter: {
      type: 'projects',
      projectIds: entries,
    },
  })

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

  const chartMeta = useMemo(() => {
    return {
      value: {
        color: 'var(--project-primary, var(--ecosystem-primary))',
        indicatorType: { shape: 'line' },
        label:
          type === 'ecosystem'
            ? 'Total Value Secured'
            : type === 'daLayer'
              ? 'L2s TVS'
              : 'TVS',
      },
    } satisfies ChartMeta
  }, [type])

  const stats = getStats(chartData, allScalingProjectsTvs)
  const range = getChartRange(chartData)

  return (
    <PrimaryCard className="rounded-lg! border border-divider">
      <Header range={range} stats={stats} unit={'usd'} />
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        className="h-44! min-h-44!"
      >
        <AreaChart data={chartData} accessibilityLayer margin={{ top: 20 }}>
          <defs>
            <CustomFillGradientDef
              id={id}
              colors={{
                primary: 'var(--project-primary, var(--ecosystem-primary))',
                secondary:
                  'var(--project-secondary, var(--ecosystem-secondary))',
              }}
            />
          </defs>
          <Area
            dataKey="value"
            fill={`url(#${id})`}
            fillOpacity={1}
            stroke="var(--project-primary, var(--ecosystem-primary))"
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, 'usd'),
            },
            syncedUntil: data?.syncedUntil,
          })}
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
  range,
  stats,
  unit,
}: {
  range: [number, number] | undefined
  stats: { total: number; marketShare: number } | undefined
  unit: string
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">TVS</div>
        <EcosystemChartTimeRange range={range} />
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
  allScalingProjectsTvs: number,
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
    marketShare: last.value / allScalingProjectsTvs,
  }
}
