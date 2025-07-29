import { useMemo, useState } from 'react'
import { Area, AreaChart } from 'recharts'
import type { TvsChartDataPoint } from '~/components/chart/tvs/TvsChart'
import { TvsCustomTooltip } from '~/components/chart/tvs/TvsChart'
import { TvsChartTimeRangeControls } from '~/components/chart/tvs/TvsChartTimeRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { Skeleton } from '~/components/core/Skeleton'
import type {
  EcosystemEntry,
  EcosystemMilestone,
} from '~/server/features/ecosystems/getEcosystemEntry'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { EcosystemWidget } from '../widgets/EcosystemWidget'
import { EcosystemChartTimeRange } from './EcosystemsChartTimeRange'
import { EcosystemsMarketShare } from './EcosystemsMarketShare'

export function EcosystemsTvsChart({
  name,
  entries,
  allScalingProjectsTvs,
  className,
  ecosystemMilestones,
}: {
  name: string
  entries: EcosystemEntry['liveProjects']
  allScalingProjectsTvs: number
  className?: string
  ecosystemMilestones: EcosystemMilestone[]
}) {
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: {
      type: timeRange,
    },
    excludeAssociatedTokens: false,
    filter: {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    },
  })

  const chartData: TvsChartDataPoint[] | undefined = data?.chart.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total =
        native !== null && canonical !== null && external !== null
          ? native + canonical + external
          : null
      const divider = unit === 'usd' ? 1 : ethPrice
      return {
        timestamp,
        value:
          total !== null && divider !== null && divider !== 0
            ? total / divider
            : null,
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
    <EcosystemWidget className={className}>
      <Header range={range} stats={stats} unit={unit} />
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        className="h-44! min-h-44!"
        milestones={ecosystemMilestones}
      >
        <AreaChart data={chartData} accessibilityLayer margin={{ top: 20 }}>
          <defs>
            <CustomFillGradientDef
              id="fill"
              colors={{
                primary: 'var(--ecosystem-primary)',
                secondary: 'var(--ecosystem-secondary)',
              }}
            />
          </defs>
          <Area
            dataKey="value"
            fill="url(#fill)"
            fillOpacity={1}
            stroke="var(--ecosystem-primary)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, unit),
            },
            syncedUntil: data?.syncedUntil,
          })}
          <ChartTooltip content={<TvsCustomTooltip unit={unit} />} />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
      <ChartControlsWrapper className="mt-2.5">
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          projectSection={true}
        />
      </ChartControlsWrapper>
    </EcosystemWidget>
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
