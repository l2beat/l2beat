'use client'

import { sum } from 'lodash'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { Skeleton } from '~/components/core/skeleton'
import { CustomLink } from '~/components/link/custom-link'
import { PercentChange } from '~/components/percent-change'
import { ChevronIcon } from '~/icons/chevron'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import type { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { useChartLoading } from '../core/chart-loading-context'
import { type SeriesStyle } from '../core/styles'
import type { ChartUnit } from '../types'
import { TvlChartHover2 } from './tvl-chart-hover-2'

export function ScalingSummaryTvlChart({
  unit,
  timeRange,
}: { unit: ChartUnit; timeRange: TvlChartRange }) {
  const { data, isLoading } = api.tvl.chartV2.useQuery({
    range: timeRange,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
  })

  const formatYAxisLabel = useCallback(
    (value: number) => formatCurrency(value, unit),
    [unit],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const { values, data } = getChartValues(dataPoint, unit)

        return {
          values,
          data,
        }
      }) ?? [],
    [data, unit],
  )

  const total = useMemo(() => {
    const lastColumn = columns.at(-1)
    if (!lastColumn) {
      return undefined
    }
    return {
      usd:
        lastColumn.data.rollups.usd +
        lastColumn.data.validiumAndOptimiums.usd +
        lastColumn.data.others.usd,
      eth:
        lastColumn.data.rollups.eth +
        lastColumn.data.validiumAndOptimiums.eth +
        lastColumn.data.others.eth,
    }
  }, [columns])

  const firstValue = useMemo(
    () => sum(columns[0]?.values.map((value) => value.value)),
    [columns],
  )
  const lastValue = useMemo(
    () => sum(columns[columns.length - 1]?.values.map((value) => value.value)),
    [columns],
  )
  const change = useMemo(
    () => (lastValue && firstValue ? lastValue / firstValue - 1 : 0),
    [firstValue, lastValue],
  )

  const valuesStyle: SeriesStyle[] = useMemo(
    () => [
      {
        line: 'blue',
        point: 'circle',
      },
      {
        line: 'yellow',
      },
      {
        line: 'pink',
      },
    ],
    [],
  )

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => <TvlChartHover2 data={data} />}
    >
      <section className="flex flex-col gap-4">
        <Header
          total={total}
          change={change}
          unit={unit}
          timeRange={timeRange}
        />
        <Chart disableMilestones />
      </section>
    </ChartProvider>
  )
}

interface Props {
  total: Record<ChartUnit, number | undefined> | undefined
  change: number
  unit: ChartUnit
  timeRange: TvlChartRange
}

function Header({ total, unit, change, timeRange }: Props) {
  const loading = useChartLoading()
  const value = total?.[unit]
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Value Locked</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-blue-400 px-3 py-2 text-[13px] font-bold leading-none text-[#1459CB] dark:border-blue-500 dark:text-blue-500 max-md:hidden"
            href="/scaling/tvl"
          >
            View details
            <ChevronIcon className="size-2.5 -rotate-90 fill-current" />
          </Link>
        </div>
        <CustomLink
          href="/scaling/tvl"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="size-2 -rotate-90 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold">
          {value === undefined ? (
            <Skeleton className="my-[5px] h-5 w-32" />
          ) : (
            formatCurrency(value, unit)
          )}
        </div>
        {loading ? (
          <Skeleton className="my-0.5 h-4 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs">
            <PercentChange value={change} />
            <span className="text-secondary"> / {timeRange}</span>
          </p>
        )}
      </div>
    </div>
  )
}

type TvlDataPoint = readonly [number, number, number, number, number]

function getChartValues(dataPoint: TvlDataPoint, unit: CostsUnit) {
  const [timestamp, rollups, validiumAndOptimiums, others, ethPrice] = dataPoint
  const rollupsUsd = rollups / 100
  const rollupsEth = rollupsUsd / ethPrice

  const validiumAndOptimiumsUsd = validiumAndOptimiums / 100
  const validiumAndOptimiumsEth = validiumAndOptimiumsUsd / ethPrice

  const othersUsd = others / 100
  const othersEth = othersUsd / ethPrice

  return {
    values:
      unit === 'usd'
        ? [
            { value: rollupsUsd },
            { value: validiumAndOptimiumsUsd },
            { value: othersUsd },
          ]
        : [
            { value: rollupsEth },
            { value: validiumAndOptimiumsEth },
            { value: othersEth },
          ],
    data: {
      timestamp,
      rollups: {
        usd: rollupsUsd,
        eth: rollupsEth,
      },
      validiumAndOptimiums: {
        usd: validiumAndOptimiumsUsd,
        eth: validiumAndOptimiumsEth,
      },
      others: {
        usd: othersUsd,
        eth: othersEth,
      },
    },
  }
}
