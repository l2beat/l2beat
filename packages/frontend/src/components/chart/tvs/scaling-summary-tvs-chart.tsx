'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { getCommonChartComponents } from '~/components/core/chart/common'
import {
  OthersFillGradientDef,
  OthersStrokeGradientDef,
} from '~/components/core/chart/defs/others-gradient-def'
import {
  RollupsFillGradientDef,
  RollupsStrokeGradientDef,
} from '~/components/core/chart/defs/rollups-gradient-def'
import {
  ValidiumsAndOptimiumsFillGradientDef,
  ValidiumsAndOptimiumsStrokeGradientDef,
} from '~/components/core/chart/defs/validiums-and-optimiums-gradient-def'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Skeleton } from '~/components/core/skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { CustomLink } from '~/components/link/custom-link'
import { PercentChange } from '~/components/percent-change'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { ChevronIcon } from '~/icons/chevron'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import type { ChartUnit } from '../types'

const chartConfig = {
  rollups: {
    label: 'Rollups',
    color: 'hsl(var(--indicator-rollups))',
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'hsl(var(--indicator-validiums-optimiums))',
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--indicator-others))',
  },
} satisfies ChartConfig

export function ScalingSummaryTvsChart({
  unit,
  timeRange,
}: { unit: ChartUnit; timeRange: TvsChartRange }) {
  const { checked } = useRecategorisationPreviewContext()
  const { data, isLoading } = api.tvs.recategorisedChart.useQuery({
    range: timeRange,
    excludeAssociatedTokens: false,
    filter: { type: 'layer2' },
    previewRecategorisation: checked,
  })

  const chartData = useMemo(() => {
    return data?.map(([timestamp, rollups, validiumsAndOptimiums, others]) => {
      return {
        timestamp,
        rollups: rollups / 100,
        validiumsAndOptimiums: validiumsAndOptimiums / 100,
        others: others / 100,
      }
    })
  }, [data])
  const stats = getStats(chartData)

  return (
    <section className="flex flex-col gap-4">
      <Header
        total={stats?.total}
        change={stats?.change}
        unit={unit}
        timeRange={timeRange}
      />
      <ChartContainer config={chartConfig} isLoading={isLoading}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <RollupsFillGradientDef id="rollups-fill" />
            <RollupsStrokeGradientDef id="rollups-stroke" />
            <ValidiumsAndOptimiumsFillGradientDef id="validiums-and-optimiums-fill" />
            <ValidiumsAndOptimiumsStrokeGradientDef id="validiums-and-optimiums-stroke" />
            <OthersFillGradientDef id="others-fill" />
            <OthersStrokeGradientDef id="others-stroke" />
          </defs>
          <ChartTooltip content={<CustomTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="rollups"
            stroke="url(#rollups-stroke)"
            fill="url(#rollups-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            dataKey="validiumsAndOptimiums"
            stroke="url(#validiums-and-optimiums-stroke)"
            fill="url(#validiums-and-optimiums-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Area
            dataKey="others"
            stroke="url(#others-stroke)"
            fill="url(#others-fill)"
            fillOpacity={1}
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            chartData,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, unit),
            },
          })}
        </AreaChart>
      </ChartContainer>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || typeof label !== 'number') return null
  const total = payload.reduce((acc, curr) => acc + (curr?.value ?? 0), 0)
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex !w-[158px] flex-col gap-1 [@media(min-width:600px)]:!w-60">
        <div>{formatTimestamp(label, { longMonthName: true })}</div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-secondary">
          <span className="[@media(min-width:600px)]:hidden">Total</span>
          <span className="hidden [@media(min-width:600px)]:inline">
            Total value secured
          </span>
          <span className="text-primary">{formatCurrency(total, 'usd')}</span>
        </div>
        <HorizontalSeparator />
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = chartConfig[entry.name as keyof typeof chartConfig]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <div
                    role="img"
                    aria-label="Square icon"
                    className="size-3 rounded"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatCurrency(entry.value, 'usd')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
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
          <span className="text-xl font-bold">Value Secured</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 text-[13px] font-bold leading-none text-link max-md:hidden"
            href="/scaling/tvs"
          >
            View details
            <ChevronIcon className="size-2.5 -rotate-90 fill-current" />
          </Link>
        </div>
        <CustomLink
          href="/scaling/tvs"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="size-2 -rotate-90 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold">
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
        rollups: number
        validiumsAndOptimiums: number
        others: number
      }[]
    | undefined,
) {
  if (!data) {
    return undefined
  }
  const oldestDataPoint = data.at(0)
  const newestDataPoint = data.at(-1)
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
