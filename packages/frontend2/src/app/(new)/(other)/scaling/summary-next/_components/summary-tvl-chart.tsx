'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(new)/(other)/_components/scaling-filter-context'
import { ChartTimeRangeControls } from '~/app/_components/chart/controls/chart-time-range-controls'
import { Chart } from '~/app/_components/chart/core/chart'
import { useChartLoading } from '~/app/_components/chart/core/chart-loading-context'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { mapMilestones } from '~/app/_components/chart/utils/map-milestones'
import { PercentChange } from '~/app/_components/percent-change'
import { Skeleton } from '~/app/_components/skeleton'
import { INFINITY } from '~/consts/characters'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { type TvlLayer2ProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency, formatCurrencyExactValue } from '~/utils/format'
import { tvlRangeToReadable } from '../../_utils/tvl-range-to-readable'
import { UnitAndScaleControls } from '../../_components/unit-and-scale-controls'

interface TvlChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}

interface Props {
  milestones: Milestone[]
  tag?: string
  entries: ScalingSummaryEntry[]
}

export function SummaryTvlChart({
  milestones,
  entries,
  tag = 'summary',
}: Props) {
  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useCookieState('scalingSummaryChartRange')

  const [unit, setUnit] = useLocalStorage<'usd' | 'eth'>(`${tag}-unit`, 'usd')
  const [scale, setScale] = useLocalStorage(`${tag}-scale`, 'lin')

  const chartDataType = useMemo<TvlLayer2ProjectFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'layer2' }
    }

    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, filters, includeFilter])

  const scalingSummaryQuery = api.scaling.summary.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens: filters.excludeAssociatedTokens,
    ...chartDataType,
  })

  const { data } = scalingSummaryQuery

  const mappedMilestones = mapMilestones(milestones)

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

  const firstValue = columns[0]?.values[0]?.value
  const lastValue = columns[columns.length - 1]?.values[0]!.value ?? undefined
  const change =
    lastValue && firstValue ? lastValue / firstValue - 1 : undefined

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
        <Header
          unit={unit}
          value={lastValue}
          change={change}
          range={timeRange}
        />
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
          Sum of all canonically bridged, externally bridged, and natively
          minted tokens, converted to {unit.toUpperCase()}
        </p>
      </div>
      <div className="flex flex-row items-baseline gap-2 md:flex-col md:items-end md:gap-1">
        <p className="whitespace-nowrap text-right text-lg font-bold md:text-3xl">
          {!value || loading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            formatCurrency(value, unit, {
              showLessThanMinimum: false,
            })
          )}
        </p>
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
