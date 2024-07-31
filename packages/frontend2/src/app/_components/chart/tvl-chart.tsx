'use client'

import { type Milestone } from '@l2beat/config'
import { ChartTimeRangeControls } from '~/app/_components/chart/controls/chart-time-range-controls'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { PercentChange } from '~/app/_components/percent-change'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type TvlChartRange } from '~/server/features/tvl/range-utils'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency, formatCurrencyExactValue } from '~/utils/format'
import { useChartLoading } from './core/chart-loading-context'
import { useIsClient } from '~/hooks/use-is-client'
import { useCookieState } from '~/hooks/use-cookie-state'

interface TvlChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}

interface Props {
  milestones: Milestone[]
  tag?: string
}

export function TvlChart({ milestones, tag = 'summary' }: Props) {
  const [timeRange, setTimeRange] = useCookieState('chartRange')
  const [unit, setUnit] = useLocalStorage<'usd' | 'eth'>(`${tag}-unit`, 'usd')
  const [scale, setScale] = useLocalStorage(`${tag}-scale`, 'lin')

  const scalingSummaryQuery = api.scaling.summary.useQuery({
    range: timeRange,
    type: 'layer2',
  })

  const data = scalingSummaryQuery.data?.chart

  const mappedMilestones = getMilestones(milestones)
  const rangeStart = data?.[0]?.[0] ?? 0
  const rangeEnd = data?.[data.length - 1]?.[0] ?? 1

  const columns =
    data?.map((d) => {
      const timestamp = d[0]
      const usdSum = d.slice(1, 4).reduce((a, b) => a + b, 0)
      const ethPrice = d[4]
      const usdValue = usdSum / 100
      const ethValue = usdSum / ethPrice

      return {
        values: [{ value: unit === 'usd' ? usdValue : ethValue }],
        data: {
          timestamp,
          usdValue,
          ethValue,
        },
        milestone: mappedMilestones[timestamp],
      }
    }) ?? []

  const firstTvlRecord = columns.at(0)?.data ?? { usdValue: 0, ethValue: 0 }
  const latestTvlRecord = columns.at(-1)?.data ?? { usdValue: 0, ethValue: 0 }
  const tvl = latestTvlRecord[unit === 'usd' ? 'usdValue' : 'ethValue']
  const pastTvl = firstTvlRecord[unit === 'usd' ? 'usdValue' : 'ethValue']
  const tvlChange = Number((((tvl - pastTvl) / pastTvl) * 100).toFixed(2))

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
        <Header unit={unit} value={tvl} change={tvlChange} range={timeRange} />
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
  change,
  range,
}: {
  unit: string
  value: number
  change: number
  range: TvlChartRange
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
              <PercentChange value={change} /> / {tvlRangeToReadable(range)}
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
  const isClient = useIsClient()

  if (!isClient) {
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

function getMilestones(milestones: Milestone[]): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}

function tvlRangeToReadable(range: TvlChartRange) {
  if (range === 'max') {
    return 'All time'
  }
  const number = range.slice(0, -1)
  const plural = number !== '1'
  if (range.endsWith('d')) {
    return `${number} ${plural ? 'days' : 'day'}`
  }
  if (range.endsWith('y')) {
    return `${number} ${plural ? 'years' : 'year'}`
  }
  throw new Error('Invalid range')
}
