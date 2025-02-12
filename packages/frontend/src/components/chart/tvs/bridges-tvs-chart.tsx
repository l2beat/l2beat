'use client'
import { useState } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip } from '~/components/core/chart/chart'
import { getXAxisProps } from '~/components/core/chart/get-x-axis-props'
import {
  SignatureGradientFillDef,
  SignatureGradientStrokeDef,
} from '~/components/core/chart/signature-gradient-def'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { INFINITY } from '~/consts/characters'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { Skeleton } from '../../core/skeleton'
import { PercentChange } from '../../percent-change'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { useChartLoading } from '../core/chart-loading-context'
import { ChartTimeRange } from '../core/chart-time-range'
import type { ChartUnit } from '../types'
import { TvsChartTimeRangeControls } from './tvs-chart-time-range-controls'
import { TvsChartUnitControls } from './tvs-chart-unit-controls'
import { tvsRangeToReadable } from './tvs-range-to-readable'
import { useTvsChartRenderParams } from './use-tvs-chart-render-params'

interface DataPoint {
  timestamp: number
  usd: number
  eth: number
}

export function BridgesTvsChart() {
  const [unit, setUnit] = useLocalStorage<ChartUnit>(
    'bridges-summary-unit',
    'usd',
  )
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    filter: { type: 'bridge' },
    excludeAssociatedTokens: false,
  })

  const chartConfig = {
    usd: {
      label: 'USD',
      color: 'hsl(var(--chart-ethereum))',
    },
  } satisfies ChartConfig
  const chartData: DataPoint[] | undefined = data?.map(
    ([timestamp, native, canonical, external, ethPrice]) => {
      const total = native + canonical + external
      return {
        timestamp,
        usd: total / 100,
        eth: total / ethPrice,
      }
    },
  )

  const { chartRange, change, total } = useTvsChartRenderParams({
    milestones: [],
    unit,
    data,
  })

  return (
    <section className="flex flex-col gap-4">
      <BridgesChartHeader
        unit={unit}
        value={total?.[unit]}
        change={change}
        range={timeRange}
        timeRange={chartRange}
      />
      <ChartContainer config={chartConfig} isLoading={isLoading}>
        <AreaChart data={chartData} margin={{ top: 20 }}>
          <defs>
            <SignatureGradientFillDef id={'signature-gradient-fill'} />
            <SignatureGradientStrokeDef id={'signature-gradient-stroke'} />
          </defs>
          <ChartTooltip content={<CustomTooltip />} />
          <Area
            dataKey={unit}
            type="natural"
            fill="url(#signature-gradient-fill)"
            fillOpacity={1}
            stroke="url(#signature-gradient-stroke)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <CartesianGrid vertical={false} />
          <XAxis {...getXAxisProps(chartData)} />
          <YAxis
            tickLine={false}
            axisLine={false}
            mirror
            tickCount={3}
            dy={-10}
            tickFormatter={(value: number) => formatCurrency(value, unit)}
          />
        </AreaChart>
      </ChartContainer>
      <ChartControlsWrapper>
        <TvsChartUnitControls unit={unit} setUnit={setUnit} />
        <TvsChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <div className={cn(tooltipContentVariants(), 'flex flex-col gap-1')}>
      <div>
        {formatTimestamp(label, { mode: 'datetime', longMonthName: true })}
      </div>
      <HorizontalSeparator className="my-1" />
      {payload.map((entry) => {
        const entryPayload = entry.payload as DataPoint
        return (
          <div key={entry.name}>
            <div className="flex w-full items-center justify-between gap-2">
              <span>USD</span>
              <span className="font-medium">
                {formatCurrency(entryPayload.usd, 'usd')}
              </span>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <span>ETH</span>
              <span className="font-medium">
                {formatCurrency(entryPayload.eth, 'eth')}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function BridgesChartHeader({
  unit,
  value,
  change,
  range,
  timeRange,
}: {
  unit: string
  value?: number
  change?: number
  range: TvsChartRange
  timeRange: [number, number] | undefined
}) {
  const loading = useChartLoading()

  const changeOverTime =
    range === 'max' ? (
      INFINITY
    ) : change ? (
      <PercentChange value={change} textClassName="lg:w-[63px] lg:text-base" />
    ) : null

  return (
    <header className="flex justify-between">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Value Secured</h1>
        <ChartTimeRange range={timeRange} />
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold md:text-2xl">
          {!value || loading ? (
            <Skeleton className="my-0.5 h-[26px] w-32 md:h-8" />
          ) : (
            formatCurrency(value, unit)
          )}
        </div>
        {loading ? (
          <Skeleton className="h-5 w-32 lg:h-6" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs font-medium text-secondary lg:text-base">
            {changeOverTime} / {tvsRangeToReadable(range)}
          </p>
        )}
      </div>
    </header>
  )
}
