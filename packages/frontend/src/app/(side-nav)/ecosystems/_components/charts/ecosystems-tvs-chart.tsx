'use client'
import { useMemo, useState } from 'react'
import { Area, AreaChart } from 'recharts'
import type { EcosystemEntry } from 'rewrite/src/server/features/ecosystems/get-ecosystem-entry'
import type { TvsChartRange } from 'rewrite/src/server/features/scaling/tvs/utils/range'
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
import { CustomFillGradientDef } from '~/components/core/chart/defs/custom-gradient-def'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { Skeleton } from '~/components/core/skeleton'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { EcosystemWidget } from '../widgets/ecosystem-widget'
import { EcosystemChartTimeRange } from './ecosystems-chart-time-range'
import { EcosystemsMarketShare } from './ecosystems-market-share'

export function EcosystemsTvsChart({
  name,
  entries,
  allScalingProjectsTvs,
  className,
}: {
  name: string
  entries: EcosystemEntry['projects']
  allScalingProjectsTvs: number
  className?: string
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
    previewRecategorisation: false,
  })

  const chartData: TvsChartDataPoint[] | undefined = data?.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total = native + canonical + external
      const divider = unit === 'usd' ? 1 : ethPrice
      return {
        timestamp,
        value: total / divider,
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
        className="!h-44 !min-h-44"
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
    <div className="mb-3 flex items-center justify-between">
      <div>
        <div className="text-xl font-bold">TVS</div>
        <EcosystemChartTimeRange range={range} />
      </div>
      <div className="text-right">
        {stats?.total ? (
          <div className="text-xl font-bold">
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
