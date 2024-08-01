'use client'

import { type Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { ChartTimeRangeControls } from '~/app/_components/chart/controls/chart-time-range-controls'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { getEntriesByDays } from '~/app/_components/chart/utils/get-entries-by-days'
import { PercentChange } from '~/app/_components/percent-change'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type TvlCharts } from '~/server/features/scaling/get-tvl'
import { getTvlWithChange } from '~/server/features/scaling/utils/get-tvl-with-change'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency, formatCurrencyExactValue } from '~/utils/format'
import { useChartLoading } from './core/chart-loading-context'
import { mapMilestones } from './utils/map-milestones'

interface TvlChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}

interface Props {
  data: TvlCharts
  milestones: Milestone[]
  tag?: string
}

export function TvlChart({ data, milestones, tag = 'summary' }: Props) {
  const [timeRange, setTimeRange] = useLocalStorage(`${tag}-time-range`, '30d')
  const [unit, setUnit] = useLocalStorage<'usd' | 'eth'>(`${tag}-unit`, 'usd')
  const [scale, setScale] = useLocalStorage(`${tag}-scale`, 'lin')

  const mappedMilestones = mapMilestones(milestones)
  const dataInRange = getEntriesByDays(toDays(timeRange), data, {
    trimLeft: true,
  })
  const rangeStart = dataInRange[0]?.[0]
  const rangeEnd = dataInRange[dataInRange.length - 1]?.[0]
  assert(
    rangeStart !== undefined && rangeEnd !== undefined,
    'Programmer error: rangeStart and rangeEnd are undefined',
  )

  const columns = dataInRange.map((d) => {
    const timestamp = d[0]
    const usdValue = d[1]
    const ethValue = d[5]

    return {
      values: [{ value: unit === 'usd' ? usdValue : ethValue }],
      data: {
        timestamp,
        usdValue,
        ethValue,
      },
      milestone: mappedMilestones[timestamp],
    }
  })

  const { tvl, tvlWeeklyChange } = getTvlWithChange(data, unit)

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={[
        {
          fill: 'signature gradient',
          line: 'signature gradient',
          point: 'circle',
        },
      ]}
      formatYAxisLabel={(value: number) =>
        formatCurrency(value, unit, { showLessThanMinimum: false })
      }
      range={[rangeStart, rangeEnd]}
      useLogScale={scale === 'log'}
      renderHoverContents={(data) => <ChartHover data={data} />}
    >
      <section className="flex flex-col gap-4">
        <Header unit={unit} value={tvl} weeklyChange={tvlWeeklyChange} />
        <ChartTimeRangeControls
          value={timeRange}
          setValue={setTimeRange}
          options={[
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
            { value: '90d', label: '90D' },
            { value: '180d', label: '180D' },
            { value: '1y', label: '1Y' },
            { value: 'max', label: 'MAX' },
          ]}
          range={[rangeStart, rangeEnd]}
        />
        <Chart />
        <UnitAndScaleControls
          unit={unit}
          scale={scale}
          setUnit={setUnit}
          setScale={setScale}
        />
      </section>
    </ChartProvider>
  )
}

function ChartHover({ data }: { data: TvlChartPointData }) {
  const formattedUsd = formatCurrencyExactValue(data.usdValue, 'USD')
  const formattedEth = formatCurrencyExactValue(data.ethValue, 'ETH')
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">USD</span>
        {formattedUsd}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">ETH</span>
        {formattedEth}
      </div>
    </div>
  )
}

function Header({
  unit,
  value,
  weeklyChange,
}: {
  unit: string
  value: number
  weeklyChange: string
}) {
  const loading = useChartLoading()

  return (
    <header className="flex flex-col justify-between text-base md:flex-row">
      <div>
        <h1 className="mb-1 text-3xl font-bold">Value Locked</h1>
        <p className="hidden text-gray-500 dark:text-gray-600 md:block">
          Sum of all canonically bridged, externally bridged, and natively
          minted tokens, converted to {unit.toUpperCase()}
        </p>
      </div>
      <div className="flex flex-row items-baseline gap-2 md:flex-col md:items-end md:gap-1">
        {loading ? (
          <>
            <Skeleton className="h-9 w-[124px]" />
            <Skeleton className="h-6 w-[119px]" />
          </>
        ) : (
          <>
            <p className="whitespace-nowrap text-right text-lg font-bold md:text-3xl">
              {formatCurrency(value, unit, {
                showLessThanMinimum: false,
              })}
            </p>
            <p className="whitespace-nowrap text-right text-xs font-bold md:text-base">
              <PercentChange value={weeklyChange} /> / 7 days
            </p>
          </>
        )}
      </div>
      <hr className="mt-2 w-full border-gray-200 dark:border-zinc-700 md:hidden md:border-t" />
    </header>
  )
}

function UnitAndScaleControls({
  unit,
  scale,
  setUnit,
  setScale,
}: {
  unit: string
  scale: string
  setUnit: (value: 'usd' | 'eth') => void
  setScale: (value: string) => void
}) {
  const loading = useChartLoading()

  if (loading) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-[104.82px]" />
        <Skeleton className="h-8 w-[98.63px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <RadioGroup value={unit} onValueChange={setUnit}>
        <RadioGroupItem value="usd">USD</RadioGroupItem>
        <RadioGroupItem value="eth">ETH</RadioGroupItem>
      </RadioGroup>
      <RadioGroup value={scale} onValueChange={setScale}>
        <RadioGroupItem value="log">LOG</RadioGroupItem>
        <RadioGroupItem value="lin">LIN</RadioGroupItem>
      </RadioGroup>
    </div>
  )
}

function toDays(value: string) {
  if (value.endsWith('d')) {
    return parseInt(value.slice(0, -1))
  } else if (value.endsWith('y')) {
    return parseInt(value.slice(0, -1)) * 365
  } else {
    return Infinity
  }
}
