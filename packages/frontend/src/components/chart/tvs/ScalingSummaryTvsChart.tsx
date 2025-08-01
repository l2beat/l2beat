import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
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
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { CustomLink } from '~/components/link/CustomLink'
import { PercentChange } from '~/components/PercentChange'
import { ChevronIcon } from '~/icons/Chevron'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ChartUnit } from '../types'

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

export function ScalingSummaryTvsChart({
  unit,
  timeRange,
}: {
  unit: ChartUnit
  timeRange: TvsChartRange
}) {
  const { data, isLoading } = api.tvs.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'layer2' },
  })

  const chartData = useMemo(() => {
    return data?.chart.map(
      ([timestamp, rollups, validiumsAndOptimiums, others]) => {
        return {
          timestamp,
          rollups,
          validiumsAndOptimiums,
          others,
        }
      },
    )
  }, [data])
  const stats = getStats(chartData)

  return (
    <div className="flex flex-col gap-4">
      <Header
        total={stats?.total}
        change={stats?.change}
        unit={unit}
        timeRange={timeRange}
      />
      <ChartContainer meta={chartMeta} data={chartData} isLoading={isLoading}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <PinkFillGradientDef id="rollups-fill" />
            <PinkStrokeGradientDef id="rollups-stroke" />
            <CyanFillGradientDef id="validiums-and-optimiums-fill" />
            <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
            <YellowFillGradientDef id="others-fill" />
            <YellowStrokeGradientDef id="others-stroke" />
          </defs>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: [
              {
                dataKey: 'rollups',
                stroke: 'url(#rollups-stroke)',
                fill: 'url(#rollups-fill)',
              },
              {
                dataKey: 'validiumsAndOptimiums',
                stroke: 'url(#validiums-and-optimiums-stroke)',
                fill: 'url(#validiums-and-optimiums-fill)',
              },
              {
                dataKey: 'others',
                stroke: 'url(#others-stroke)',
                fill: 'url(#others-fill)',
              },
            ],
          })}
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, unit),
            },
            syncedUntil: data?.syncedUntil,
          })}
          <ChartTooltip content={<CustomTooltip />} filterNull={false} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || typeof label !== 'number') return null

  const validPayload = payload.filter((p) => p.type !== 'none')
  const total = validPayload.reduce<number | null>((acc, curr) => {
    if (curr.value === null || curr.value === undefined) {
      return acc
    }
    if (acc === null) {
      return curr?.value ?? null
    }
    return acc + curr.value
  }, null)
  const isFullDay = UnixTime.isFull(UnixTime(label), 'day')
  return (
    <ChartTooltipWrapper>
      <div className="flex w-[180px]! flex-col [@media(min-width:600px)]:w-60!">
        <div className="mb-3 font-medium text-label-value-14 text-secondary">
          {isFullDay
            ? formatTimestamp(label, { longMonthName: true })
            : formatTimestamp(label, {
                longMonthName: true,
                mode: 'datetime',
              })}
        </div>
        <div className="mb-1.5 flex w-full items-center justify-between gap-2 text-heading-16">
          <span className="[@media(min-width:600px)]:hidden">Total</span>
          <span className="hidden [@media(min-width:600px)]:inline">
            Total value secured
          </span>
          <span className="text-primary">
            {total !== null ? formatCurrency(total, 'usd') : 'No data'}
          </span>
        </div>
        <HorizontalSeparator />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.type === 'none') return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
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
                  {entry.value !== null && entry.value !== undefined
                    ? formatCurrency(entry.value, 'usd')
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

interface Props {
  total: number | undefined
  change: number | undefined
  unit: ChartUnit
  timeRange: TvsChartRange
}

function Header({ total, unit, change, timeRange }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl">Value Secured</span>
          <a
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none max-md:hidden"
            href="/scaling/tvs"
          >
            View details
            <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
          </a>
        </div>
        <CustomLink
          href="/scaling/tvs"
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
            <span className="text-secondary"> / {timeRange}</span>
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
) {
  if (!data) {
    return undefined
  }
  const pointsWithData = data.filter(
    (point) =>
      point.rollups !== null &&
      point.validiumsAndOptimiums !== null &&
      point.others !== null,
  ) as {
    timestamp: number
    rollups: number
    validiumsAndOptimiums: number
    others: number
  }[]

  const oldestDataPoint = pointsWithData.at(0)
  const newestDataPoint = pointsWithData.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const oldestTotal =
    oldestDataPoint.rollups +
    oldestDataPoint.validiumsAndOptimiums +
    oldestDataPoint.others
  const newestTotal =
    newestDataPoint.rollups +
    newestDataPoint.validiumsAndOptimiums +
    newestDataPoint.others
  const change = newestTotal / oldestTotal - 1

  return {
    total: newestTotal,
    change,
  }
}
