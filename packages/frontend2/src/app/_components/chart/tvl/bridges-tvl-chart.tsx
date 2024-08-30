'use client'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { INFINITY } from '~/consts/characters'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/format'
import { PercentChange } from '../../percent-change'
import { Skeleton } from '../../skeleton'
import { useChartLoading } from '../core/chart-loading-context'
import { TvlChartHover } from './tvl-chart-hover'
import { TvlChartTimeRangeControls } from './tvl-chart-time-range-controls'
import { TvlChartUnitAndScaleControls } from './tvl-chart-unit-and-scale-controls'
import { tvlRangeToReadable } from './tvl-range-to-readable'
import { useTvlChartRenderParams } from './use-tvl-chart-render-params'

export function BridgesTvlChart() {
  const [scale, setScale] = useLocalStorage('bridges-summary-scale', 'lin')
  const [unit, setUnit] = useLocalStorage<'usd' | 'eth'>(
    'bridges-summary-unit',
    'usd',
  )
  const [timeRange, setTimeRange] = useCookieState('bridgesSummaryChartRange')

  const { data, isLoading } = api.tvl.chart.useQuery({
    range: timeRange,
    filter: { type: 'bridge' },
  })

  const {
    chartRange,
    formatYAxisLabel,
    valuesStyle,
    columns,
    lastValue,
    change,
  } = useTvlChartRenderParams({ milestones: [], unit, data })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={chartRange}
      isLoading={isLoading}
      useLogScale={scale === 'log'}
      renderHoverContents={(data) => <TvlChartHover data={data} />}
    >
      <section className="flex flex-col gap-4">
        <BridgesChartHeader
          unit={unit}
          value={lastValue}
          change={change}
          range={timeRange}
        />
        <TvlChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />
        <Chart />
        <TvlChartUnitAndScaleControls
          unit={unit}
          scale={scale}
          setUnit={setUnit}
          setScale={setScale}
        />
      </section>
    </ChartProvider>
  )
}

function BridgesChartHeader({
  unit,
  value,
  change,
  range,
}: {
  unit: string
  value?: number
  change?: number
  range: TvlChartRange
}) {
  const loading = useChartLoading()

  const changeOverTime =
    range === 'max' ? (
      INFINITY
    ) : change ? (
      <PercentChange value={change} />
    ) : null

  return (
    <header className="flex flex-col justify-between text-base md:flex-row">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Value Locked</h1>
        <p className="hidden text-gray-500 dark:text-gray-600 md:block">
          Sum of all funds locked on Ethereum converted to {unit.toUpperCase()}
        </p>
      </div>
      <div className="flex flex-row items-baseline gap-2 md:flex-col md:items-end md:gap-1">
        <div className="whitespace-nowrap text-right text-lg font-bold md:text-3xl">
          {!value || loading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            formatCurrency(value, unit, {
              showLessThanMinimum: false,
            })
          )}
        </div>
        {loading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs font-bold md:text-base">
            {changeOverTime} / {tvlRangeToReadable(range)}
          </p>
        )}
      </div>
      <hr className="mt-2 w-full border-gray-200 dark:border-zinc-700 md:hidden md:border-t" />
    </header>
  )
}
