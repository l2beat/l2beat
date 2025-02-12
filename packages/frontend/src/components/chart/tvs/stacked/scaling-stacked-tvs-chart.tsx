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

import type { PolygonProps, TooltipProps } from 'recharts'
import { Area, ComposedChart, Polygon, Scatter } from 'recharts'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useMilestone,
} from '~/components/core/chart/chart'
import { getCommonChartComponents } from '~/components/core/chart/common'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/project-filter-utils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import { ChartMilestoneHover } from '../../core/chart-milestone-hover'
import { mapMilestones } from '../../core/utils/map-milestones'
import type { ChartUnit } from '../../types'
import { TvsChartHeader } from '../tvs-chart-header'
import { TvsChartTimeRangeControls } from '../tvs-chart-time-range-controls'
import { useStackedTvsChartRenderParams } from './use-stacked-tvs-chart-render-params'
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

const Diamond = (
  props: PolygonProps & {
    payload?: { timestamp: number; milestone: Milestone | undefined }
  },
) => {
  const { setMilestone } = useMilestone()
  const size = 12
  const halfSize = size / 2

  const cx = (typeof props.cx === 'string' ? parseInt(props.cx) : props.cx) ?? 0
  const cy = (typeof props.cy === 'string' ? parseInt(props.cy) : props.cy) ?? 0

  if (props.payload?.milestone === undefined) {
    return null
  }

  // Calculate the points of the diamond
  const points = [
    { x: cx, y: cy - halfSize }, // Top point
    { x: cx + halfSize, y: cy }, // Right point
    { x: cx, y: cy + halfSize }, // Bottom point
    { x: cx - halfSize, y: cy }, // Left point
  ]

  return (
    <Polygon
      points={points}
      stroke="#5BFF4D"
      strokeWidth="2"
      fill="#007408"
      fillOpacity={1}
      onMouseOver={() => {
        setMilestone(props.payload?.milestone)
      }}
      onMouseLeave={() => {
        setMilestone(undefined)
      }}
      {...props}
    />
  )
}

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
        const milestone = mappedMilestones[timestamp]
        return {
          timestamp,
          native: native / divider,
          canonical: canonical / divider,
          external: external / divider,
          milestone: milestone
            ? {
                value:
                  native / divider + canonical / divider + external / divider,
                ...milestone,
              }
            : undefined,
        }
      }),
    [data, mappedMilestones, unit],
  )

  const { chartRange, change, formatYAxisLabel, total } =
    useStackedTvsChartRenderParams({
      milestones,
      unit,
      data,
    })
  return (
    <section className="flex flex-col gap-2">
      <TvsChartHeader
        unit={unit}
        value={total?.[unit]}
        change={change}
        range={timeRange}
        timeRange={chartRange}
      />
      <ChartContainer config={chartConfig} isLoading={isLoading}>
        <ComposedChart data={chartData} margin={{ top: 20 }}>
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
          <Scatter
            dataKey="milestone.value"
            shape={<Diamond />}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            chartData,
            yAxis: {
              tickFormatter: (value: number) => formatYAxisLabel(value),
            },
          })}
        </ComposedChart>
      </ChartContainer>
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
  const { milestone } = useMilestone()

  if (milestone) {
    return (
      <div className={tooltipContentVariants()}>
        <ChartMilestoneHover milestone={milestone} />
      </div>
    )
  }
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <div className={cn(tooltipContentVariants(), 'flex flex-col gap-1')}>
      {payload.map((entry) => {
        if (entry.value === undefined || entry.name === 'milestone.value')
          return null
        const config = chartConfig[entry.name as keyof typeof chartConfig]
        return (
          <div key={entry.name}>
            <div className="flex w-full items-center justify-between gap-2">
              <span>{config.label}</span>
              <span className="font-medium">
                {formatCurrency(entry.value, 'usd')}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
