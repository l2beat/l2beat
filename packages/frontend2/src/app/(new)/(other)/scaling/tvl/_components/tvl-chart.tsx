'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(new)/(other)/_components/scaling-filter-context'
import { Chart } from '~/app/_components/chart/core/chart'
import { useChartLoading } from '~/app/_components/chart/core/chart-loading-context'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { ChartTimeRangeControls } from '~/app/_components/chart/core/chart-time-range-controls'
import { mapMilestones } from '~/app/_components/chart/core/utils/map-milestones'
import { PercentChange } from '~/app/_components/percent-change'
import { Skeleton } from '~/app/_components/skeleton'
import { INFINITY } from '~/consts/characters'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TvlLayer2ProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/format'
import { useScalingAssociatedTokensContext } from '../../../_components/scaling-associated-tokens-context'
import { UnitAndScaleControls } from '../../_components/unit-and-scale-controls'
import { tvlRangeToReadable } from '../../_utils/tvl-range-to-readable'

interface Props {
  milestones: Milestone[]
  tag?: string
  entries: ScalingTvlEntry[]
}

export function TvlChart({ milestones, entries, tag = 'tvl' }: Props) {
  const filters = useScalingFilterValues()
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useCookieState('scalingTvlChartRange')

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
    excludeAssociatedTokens,
    ...chartDataType,
  })

  const { data } = scalingSummaryQuery

  const mappedMilestones = mapMilestones(milestones)

  const rangeStart = data?.[0]?.[0] ?? 0
  const rangeEnd = data?.[data.length - 1]?.[0] ?? 1

  const columns =
    data?.map((d) => {
      const [timestamp, native, canonical, external, ethPrice] = d

      return {
        values: [native + canonical + external, external + native, native].map(
          (value) => ({
            value: unit === 'usd' ? value / 100 : value / ethPrice,
          }),
        ),
        data: {
          timestamp,
          native,
          canonical,
          external,
          ethPrice,
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
          line: 'purple',
          fill: 'purple',
          point: 'circle',
        },
        {
          line: 'yellow',
          fill: 'yellow',
        },
        {
          line: 'pink',
          fill: 'pink',
        },
      ]}
      formatYAxisLabel={(value: number) =>
        formatCurrency(value, unit, { showLessThanMinimum: false })
      }
      range={[rangeStart, rangeEnd]}
      useLogScale={scale === 'log'}
      renderHoverContents={(data) => <ChartHover {...data} currency={unit} />}
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

function ChartHover(props: {
  timestamp: number
  canonical: number
  external: number
  native: number
  ethPrice: number
  currency: 'usd' | 'eth'
}) {
  const divideBy = props.currency === 'usd' ? 100 : props.ethPrice
  const total = formatCurrency(
    (props.canonical + props.external + props.native) / divideBy,
    props.currency,
  )
  const values = [
    {
      title: 'Canonical',
      value: props.canonical,
      className: 'bg-purple-100 dark:bg-purple-100',
    },
    {
      title: 'External',
      value: props.external,
      className: 'bg-yellow-200 dark:bg-yellow-200',
    },
    {
      title: 'Native',
      value: props.native,
      className: 'bg-pink-100 dark:bg-pink-100',
    },
  ]
  return (
    <div className="flex flex-col gap-1">
      <div className="whitespace-nowrap">
        {formatTimestamp(props.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">
          Total TVL
        </span>
        {total}
      </div>
      <hr className="dark:border-gray-650 w-full border-gray-200 md:border-t" />
      <div>
        {values.map(
          (v, i) =>
            v.value > 0 && (
              <div
                key={i}
                className="flex items-center justify-between gap-x-6"
              >
                <span className="flex items-center gap-1">
                  <div
                    role="img"
                    aria-label="Square icon"
                    className={cn('size-3 rounded', v.className)}
                  ></div>
                  <span>{v.title}</span>
                </span>
                <span className="font-semibold">
                  {formatCurrency(v.value / divideBy, props.currency)}
                </span>
              </div>
            ),
        )}
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
        <p className="hidden text-gray-500 md:block dark:text-gray-600">
          Sum of all canonically bridged, externally bridged, and natively
          minted tokens, converted to {unit.toUpperCase()}
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
      <hr className="mt-2 w-full border-gray-200 md:hidden md:border-t dark:border-zinc-700" />
    </header>
  )
}
