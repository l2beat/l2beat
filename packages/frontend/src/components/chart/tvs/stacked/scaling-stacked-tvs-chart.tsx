'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import { useScalingFilterValues } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { TvsChartUnitControls } from '~/components/chart/tvs/tvs-chart-unit-controls'
import { Checkbox } from '~/components/core/checkbox'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'

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
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/project-filter-utils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import { newGetChartRange } from '../../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../../core/utils/map-milestones'
import type { ChartUnit } from '../../types'
import { TvsChartHeader } from '../tvs-chart-header'
import { TvsChartTimeRangeControls } from '../tvs-chart-time-range-controls'
interface Props {
  milestones: Milestone[]
  entries: ScalingTvsEntry[]
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

const chartConfig = {
  native: {
    label: 'Native',
    color: 'hsl(var(--chart-native))',
  },
  external: {
    label: 'External',
    color: 'hsl(var(--chart-external))',
  },
  canonical: {
    label: 'Canonical',
    color: 'hsl(var(--chart-canonical))',
  },
} satisfies ChartConfig

export function ScalingStackedTvsChart({ milestones, entries, tab }: Props) {
  const { checked } = useRecategorisationPreviewContext()
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvs-unit', 'usd')

  const filter = useMemo<TvsProjectFilter>(() => {
    if (filters.isEmpty) {
      return {
        type: tab,
      }
    }
    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries, filters.isEmpty, tab])

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
    previewRecategorisation: checked,
  })

  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const chartData = useMemo(
    () =>
      data?.map(([timestamp, native, canonical, external, ethPrice]) => {
        const divider = unit === 'usd' ? 100 : ethPrice
        return {
          timestamp,
          native: native / divider,
          canonical: canonical / divider,
          external: external / divider,
          milestone: mappedMilestones[timestamp],
        }
      }),
    [data, mappedMilestones, unit],
  )

  const chartRange = newGetChartRange(chartData)
  const meta = getMeta(chartData)

  return (
    <section className="flex flex-col gap-2">
      <TvsChartHeader
        unit={unit}
        value={meta?.total}
        change={meta?.change}
        range={timeRange}
        timeRange={chartRange}
        isLoading={isLoading}
      />
      <div className="relative size-full">
        <ChartContainer
          config={chartConfig}
          isLoading={isLoading}
          dataWithMilestones={chartData}
        >
          <AreaChart data={chartData} margin={{ top: 20 }}>
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<CustomTooltip />} />
            <Area
              dataKey="native"
              type="natural"
              fill="var(--color-native)"
              fillOpacity={1}
              stroke="var(--color-native)"
              stackId="a"
              isAnimationActive={false}
              activeDot={false}
            />
            <Area
              dataKey="external"
              type="natural"
              fill="var(--color-external)"
              fillOpacity={1}
              stroke="var(--color-external)"
              stackId="a"
              isAnimationActive={false}
              activeDot={false}
            />
            <Area
              dataKey="canonical"
              type="natural"
              fill="var(--color-canonical)"
              fillOpacity={1}
              stroke="var(--color-canonical)"
              stackId="a"
              isAnimationActive={false}
              activeDot={{ stroke: 'hsl(var(--primary))' }}
            />
            {getCommonChartComponents({
              chartData,
              yAxis: {
                tickFormatter: (value: number) => formatCurrency(value, unit),
              },
            })}
          </AreaChart>
        </ChartContainer>
      </div>
      <ChartControlsWrapper>
        <TvsChartUnitControls unit={unit} setUnit={setUnit}>
          <Checkbox
            name="excludeAssociatedTokens"
            checked={excludeAssociatedTokens}
            onCheckedChange={(checked) => setExcludeAssociatedTokens(!!checked)}
          >
            Exclude associated tokens
          </Checkbox>
        </TvsChartUnitControls>
        <TvsChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
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
      <div className="flex w-36 flex-col gap-1 xs:!w-52">
        <div>
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
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

function getMeta(
  data:
    | {
        timestamp: number
        native: number
        canonical: number
        external: number
        milestone: Milestone | undefined
      }[]
    | undefined,
) {
  const oldestDataPoint = data?.at(0)
  const newestDataPoint = data?.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const total =
    newestDataPoint.native +
    newestDataPoint.canonical +
    newestDataPoint.external
  const oldestTotal =
    oldestDataPoint.native +
    oldestDataPoint.canonical +
    oldestDataPoint.external
  const change = total / oldestTotal - 1

  return {
    total,
    change,
  }
}
