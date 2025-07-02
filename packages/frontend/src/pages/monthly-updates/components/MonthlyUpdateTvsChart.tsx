import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import type { TvsChartDataPoint } from '~/components/chart/tvs/TvsChart'
import { TvsCustomTooltip } from '~/components/chart/tvs/TvsChart'
import { Skeleton } from '~/components/core/Skeleton'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/GetCommonChartComponents'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemsMarketShare } from '~/pages/ecosystems/project/components/charts/EcosystemsMarketShare'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function MonthlyUpdateTvsChart({
  name,
  entries,
  allScalingProjectsTvs,
  from,
  to,
}: {
  name: string
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

  const chartData: TvsChartDataPoint[] | undefined = data?.map(
    ([timestamp, native, canonical, external]) => {
      const total = native + canonical + external
      return {
        timestamp,
        value: total,
      }
    },
  )

  const chartMeta = useMemo(() => {
    return {
      value: {
        color: 'var(--ecosystem-primary)',
        indicatorType: { shape: 'line' },
        label: name,
      },
    } satisfies ChartMeta
  }, [name])

  const stats = getStats(chartData, allScalingProjectsTvs)
  const range = getChartRange(chartData)

  return (
    <PrimaryCard className="!rounded-lg border border-divider">
      <Header range={range} stats={stats} unit={'usd'} />
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        className="!h-44 !min-h-44"
      >
        <AreaChart data={chartData} accessibilityLayer margin={{ top: 20 }}>
          <defs>
            <CustomFillGradientDef
              id={id}
              colors={{
                primary: 'var(--ecosystem-primary)',
                secondary: 'var(--ecosystem-secondary)',
              }}
            />
          </defs>
          <Area
            dataKey="value"
            fill={`url(#${id})`}
            fillOpacity={1}
            stroke="var(--ecosystem-primary)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, 'usd'),
            },
          })}
          <ChartTooltip content={<TvsCustomTooltip unit={'usd'} fullDate />} />
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
    <div className="mb-3 flex items-center justify-between">
      <div>
        <div className="font-bold text-xl">TVS</div>
        <ChartTimeRange range={range} />
      </div>
      <div className="text-right">
        {stats?.total ? (
          <div className="font-bold text-xl">
            {formatCurrency(stats?.total, unit)}
          </div>
        ) : (
          <Skeleton className="my-[5px] ml-auto h-5 w-20" />
        )}
        <EcosystemsMarketShare marketShare={stats?.marketShare} />
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

  const last = chartData.at(-1)
  if (!last) {
    return undefined
  }

  return {
    total: last.value,
    marketShare: last.value / allScalingProjectsTvs,
  }
}
