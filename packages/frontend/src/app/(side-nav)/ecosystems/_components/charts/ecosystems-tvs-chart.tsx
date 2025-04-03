'use client'
import { useState } from 'react'
import { Area, AreaChart } from 'recharts'
import type { TvsChartDataPoint } from '~/components/chart/tvs/tvs-chart'
import { TvsCustomTooltip } from '~/components/chart/tvs/tvs-chart'
import { TvsChartTimeRangeControls } from '~/components/chart/tvs/tvs-chart-time-range-controls'
import { TvsChartUnitControls } from '~/components/chart/tvs/tvs-chart-unit-controls'
import type { ChartUnit } from '~/components/chart/types'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { ChartControlsWrapper } from '~/components/core/chart/chart-controls-wrapper'
import { ChartTimeRange } from '~/components/core/chart/chart-time-range'
import { CustomFillGradientDef } from '~/components/core/chart/defs/custom-gradient-def'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { Skeleton } from '~/components/core/skeleton'
import { EM_DASH } from '~/consts/characters'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/get-ecosystem-project-entry'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'

export function EcosystemsTvsChart({
  name,
  entries,
  color,
}: {
  name: string
  entries: EcosystemProjectEntry['projects']
  color: {
    primary: string
    secondary: string
  }
}) {
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens: false,
    filter: {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    },
  })

  const chartData: TvsChartDataPoint[] | undefined = data?.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total = native + canonical + external
      return {
        timestamp,
        value: unit === 'usd' ? total / 100 : total / ethPrice,
      }
    },
  )

  const chartMeta = {
    value: {
      color: color?.primary ?? 'hsl(var(--chart-pink))',
      indicatorType: { shape: 'line' },
      label: name,
    },
  } satisfies ChartMeta

  const stats = getStats(chartData)
  const range = getChartRange(chartData)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">TVS</div>
          <div className="text-xs font-medium text-secondary">
            <ChartTimeRange range={range} />
          </div>
        </div>
        <div className="text-right">
          {stats?.total ? (
            <div className="text-xl font-bold">
              {formatCurrency(stats?.total, unit)}
            </div>
          ) : (
            <Skeleton className="my-[5px] ml-auto h-5 w-20" />
          )}
          <div className="text-xs font-medium text-[--ecosystem-primary]">
            {stats?.domination ?? EM_DASH}% L2 market share
          </div>
        </div>
      </div>
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        milestones={[]}
      >
        <AreaChart data={chartData} accessibilityLayer margin={{ top: 20 }}>
          <defs>
            <CustomFillGradientDef id="fill" colors={color} />
          </defs>
          <Area
            dataKey="value"
            fill="url(#fill)"
            fillOpacity={1}
            stroke={color?.secondary ?? 'url(#stroke)'}
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, unit),
            },
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
        />
      </ChartControlsWrapper>
    </div>
  )
}

function getStats(chartData: TvsChartDataPoint[] | undefined) {
  if (!chartData) {
    return undefined
  }

  const last = chartData.at(-1)
  if (!last) {
    return undefined
  }

  return {
    total: last.value,
    domination: 65,
  }
}
