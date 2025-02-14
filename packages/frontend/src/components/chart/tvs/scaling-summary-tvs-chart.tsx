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
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { useChartLoading } from '../core/chart-loading-context'
import type { ChartUnit } from '../types'
import { useRecategorisedTvsChartRenderParams } from './use-recategorised-tvs-chart-render-params'

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

  const { change, total } = useRecategorisedTvsChartRenderParams({
    data,
    unit,
    milestones: [],
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

  return (
    <section className="flex flex-col gap-4">
      <Header total={total} change={change} unit={unit} timeRange={timeRange} />
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

  return (
    <div
      className={cn(
        tooltipContentVariants(),
        'flex w-[158px] flex-col gap-1 [@media(min-width:600px)]:!w-60',
      )}
    >
      <div>{formatTimestamp(label)}</div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50 [@media(min-width:600px)]:hidden">
          Total
        </span>
        <span className="hidden text-sm text-gray-700 dark:text-gray-50 [@media(min-width:600px)]:inline">
          Total value secured
        </span>
        {'$20.00B'}
      </div>
      <HorizontalSeparator />

      {payload.map((entry) => {
        if (entry.value === undefined) return null
        const config = chartConfig[entry.name as keyof typeof chartConfig]
        return (
          <div
            key={entry.name}
            className="flex items-start justify-between gap-x-1"
          >
            <span className="flex items-start gap-1">
              <div
                role="img"
                aria-label="Square icon"
                className="mt-0.5 size-3 rounded sm:mt-1"
                style={{
                  backgroundColor: config.color,
                }}
              />
              <span className="w-20 sm:w-fit">{config.label}</span>
            </span>
            <span className="whitespace-nowrap font-medium">
              {formatCurrency(entry.value, 'usd')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

interface Props {
  total: Record<ChartUnit, number | undefined> | undefined
  change: number
  unit: ChartUnit
  timeRange: TvsChartRange
}

function Header({ total, unit, change, timeRange }: Props) {
  const loading = useChartLoading()
  const value = total?.[unit]
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
