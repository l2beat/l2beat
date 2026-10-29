import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import compact from 'lodash/compact'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
  sumEntries,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { CustomLink } from '~/components/link/CustomLink'
import { PercentChange } from '~/components/PercentChange'
import { ChevronIcon } from '~/icons/Chevron'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { ChartUnit } from '../types'
import { tvsRangeToReadable } from './tvsRangeToReadable'

const chartMeta = {
  rollups: {
    label: 'Rollups',
    color: 'var(--chart-pink)',
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'var(--chart-cyan)',
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: 'var(--chart-yellow)',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

export function L2SummaryTvsChart({
  unit,
  range,
}: {
  unit: ChartUnit
  range: ChartRange
}) {
  const trpc = useTRPC()
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  const { data, isLoading } = useQuery(
    trpc.tvs.recategorisedChart.queryOptions({
      range,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
      filter: { type: 'layer2' },
    }),
  )

  const chartData = useMemo(() => toChartData(data), [data])
  const stats = getStats(chartData, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <Header
        total={stats?.total}
        change={stats?.change}
        unit={unit}
        range={range}
      />
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        legend
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
          disableOnboarding: true,
        }}
      >
        <TimeSeriesChart
          data={chartData}
          ariaLabel="Value secured"
          series={[
            {
              key: 'rollups',
              stroke: CHART_GRADIENTS.pink.stroke,
              fill: CHART_GRADIENTS.pink.fill,
            },
            {
              key: 'validiumsAndOptimiums',
              stroke: CHART_GRADIENTS.cyan.stroke,
              fill: CHART_GRADIENTS.cyan.fill,
            },
            {
              key: 'others',
              stroke: CHART_GRADIENTS.yellow.stroke,
              fill: CHART_GRADIENTS.yellow.fill,
            },
          ]}
          yAxis={{
            domain: 'autoIfSingle',
            format: (value: number) => formatCurrency(value, unit),
          }}
          syncedUntil={data?.syncedUntil}
          renderTooltip={(row, keys) => (
            <CustomTooltip row={row} visibleKeys={keys} />
          )}
        />
      </ChartContainer>
    </div>
  )
}

type ChartRow = NonNullable<ReturnType<typeof toChartData>>[number]

function CustomTooltip({
  row,
  visibleKeys,
}: {
  row: ChartRow
  visibleKeys: (keyof typeof chartMeta)[]
}) {
  const label = row.timestamp
  const payload = getTooltipEntries(row, visibleKeys)
  const total = sumEntries(payload)
  const isFullDay = UnixTime.isFull(UnixTime(label), 'day')
  return (
    <ChartTooltipWrapper>
      <div className="flex w-[180px]! flex-col [@media(min-width:600px)]:w-60!">
        <div className="font-medium text-label-value-14 text-secondary">
          {isFullDay
            ? formatTimestamp(label)
            : formatTimestamp(label, {
                mode: 'datetime',
              })}
        </div>
        {payload.length > 1 && (
          <>
            <div className="mt-3 mb-1.5 flex w-full items-center justify-between gap-2 text-heading-16">
              <span className="[@media(min-width:600px)]:hidden">Total</span>
              <span className="hidden [@media(min-width:600px)]:inline">
                Total value secured
              </span>
              <span className="text-primary">
                {total !== null ? formatCurrency(total, 'usd') : 'No data'}
              </span>
            </div>
            <HorizontalSeparator />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow
              key={entry.name}
              name={entry.name}
              gap="gap-x-1"
            >
              <ChartTooltipValue
                value={entry.value}
                format={(value) => formatCurrency(value, 'usd')}
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function toChartData(
  data:
    | { chart: [number, number | null, number | null, number | null][] }
    | undefined,
) {
  return data?.chart.map(
    ([timestamp, rollups, validiumsAndOptimiums, others]) => ({
      timestamp,
      rollups,
      validiumsAndOptimiums,
      others,
    }),
  )
}

interface Props {
  total: number | undefined
  change: number | undefined
  unit: ChartUnit
  range: ChartRange
}

function Header({ total, unit, change, range }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl">Value Secured</span>
          <a
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none max-md:hidden"
            href="/layer2s/tvs"
          >
            View details
            <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
          </a>
        </div>
        <CustomLink
          href="/layer2s/tvs"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="-rotate-90 size-2 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right font-bold text-xl">
          {total === undefined ? (
            <Skeleton className="my-[5px] h-5 w-32" />
          ) : (
            formatCurrency(total, unit)
          )}
        </div>
        {change === undefined ? (
          <Skeleton className="my-0.5 h-4 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs">
            <PercentChange value={change} />
            <span className="text-secondary">
              {' '}
              / {tvsRangeToReadable(range)}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

function getStats(
  data:
    | {
        timestamp: number
        rollups: number | null
        validiumsAndOptimiums: number | null
        others: number | null
      }[]
    | undefined,
  dataKeys: (keyof typeof chartMeta)[],
) {
  if (!data) {
    return undefined
  }
  const pointsWithData = data.filter(
    (point) =>
      point.rollups !== null ||
      point.validiumsAndOptimiums !== null ||
      point.others !== null,
  )

  const oldestDataPoint = pointsWithData.at(0)
  const newestDataPoint = pointsWithData.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const toSum = compact([
    dataKeys.includes('rollups')
      ? {
          oldest: oldestDataPoint.rollups,
          newest: newestDataPoint.rollups,
        }
      : undefined,
    dataKeys.includes('validiumsAndOptimiums')
      ? {
          oldest: oldestDataPoint.validiumsAndOptimiums,
          newest: newestDataPoint.validiumsAndOptimiums,
        }
      : undefined,
    dataKeys.includes('others')
      ? {
          oldest: oldestDataPoint.others,
          newest: newestDataPoint.others,
        }
      : undefined,
  ])

  const oldestTotal = toSum.reduce((acc, curr) => acc + (curr.oldest ?? 0), 0)
  const newestTotal = toSum.reduce((acc, curr) => acc + (curr.newest ?? 0), 0)
  const change = newestTotal / oldestTotal - 1

  return {
    total: newestTotal,
    change,
  }
}
