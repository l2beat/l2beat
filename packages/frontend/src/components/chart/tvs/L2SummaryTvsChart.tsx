import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import compact from 'lodash/compact'
import { useMemo } from 'react'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/CyanGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TsChartContainer } from '~/components/core/chart/tanstack/TsChartContainer'
import {
  TsChartTooltipWrapper,
  TsTimeSeriesChart,
} from '~/components/core/chart/tanstack/TsTimeSeriesChart'
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
      <TsChartContainer
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
        <TsTimeSeriesChart
          data={chartData}
          ariaLabel="Value secured"
          margin={{ top: 20, right: 1, left: 0 }}
          series={[
            {
              key: 'rollups',
              stroke: 'url(#rollups-stroke)',
              fill: 'url(#rollups-fill)',
              hidden: !dataKeys.includes('rollups'),
            },
            {
              key: 'validiumsAndOptimiums',
              stroke: 'url(#validiums-and-optimiums-stroke)',
              fill: 'url(#validiums-and-optimiums-fill)',
              hidden: !dataKeys.includes('validiumsAndOptimiums'),
            },
            {
              key: 'others',
              stroke: 'url(#others-stroke)',
              fill: 'url(#others-fill)',
              hidden: !dataKeys.includes('others'),
            },
          ]}
          yAxis={{
            domain: dataKeys.length === 1 ? 'auto' : undefined,
            format: (value: number) => formatCurrency(value, unit),
          }}
          syncedUntil={data?.syncedUntil}
          defs={
            <>
              <PinkFillGradientDef id="rollups-fill" />
              <PinkStrokeGradientDef id="rollups-stroke" />
              <CyanFillGradientDef id="validiums-and-optimiums-fill" />
              <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
              <YellowFillGradientDef id="others-fill" />
              <YellowStrokeGradientDef id="others-stroke" />
            </>
          }
          renderTooltip={(row, keys) => (
            <CustomTooltip row={row} visibleKeys={keys} />
          )}
        />
      </TsChartContainer>
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
  const payload = visibleKeys.map((name) => ({ name, value: row[name] }))
  const total = payload.reduce<number | null>((acc, curr) => {
    if (curr.value === null) return acc
    return (acc ?? 0) + curr.value
  }, null)
  const isFullDay = UnixTime.isFull(UnixTime(label), 'day')
  return (
    <TsChartTooltipWrapper>
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
          {payload.map((entry) => {
            const config = chartMeta[entry.name]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null
                    ? formatCurrency(entry.value, 'usd')
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </TsChartTooltipWrapper>
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
