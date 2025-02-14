'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import { useScalingFilterValues } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import type { CostsMetric } from '~/app/(side-nav)/scaling/costs/_components/costs-metric-context'
import { useCostsMetricContext } from '~/app/(side-nav)/scaling/costs/_components/costs-metric-context'
import { useCostsTimeRangeContext } from '~/app/(side-nav)/scaling/costs/_components/costs-time-range-context'
import { CostsMetricControls } from '~/app/(side-nav)/scaling/costs/_components/costs-type-controls'
import { useCostsUnitContext } from '~/app/(side-nav)/scaling/costs/_components/costs-unit-context'
import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { getCommonChartComponents } from '~/components/core/chart/common'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsProjectsFilter } from '~/server/features/scaling/costs/utils/get-costs-projects'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import { rangeToResolution } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { useChartLoading } from '../core/chart-loading-context'
import { ChartTimeRange } from '../core/chart-time-range'
import { newGetChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'

interface Props {
  tab: Exclude<CostsProjectsFilter['type'], 'all' | 'projects'>
  entries: ScalingCostsEntry[]
  milestones: Milestone[]
}

const chartConfig = {
  calldata: {
    label: 'Calldata',
    color: 'hsl(var(--chart-costs-calldata))',
  },
  blobs: {
    label: 'Blobs',
    color: 'hsl(var(--chart-costs-blobs))',
  },
  compute: {
    label: 'Compute',
    color: 'hsl(var(--chart-costs-compute))',
  },
  overhead: {
    label: 'Overhead',
    color: 'hsl(var(--chart-costs-overhead))',
  },
} satisfies ChartConfig

export function ScalingCostsChart({ tab, milestones, entries }: Props) {
  const { range, setRange } = useCostsTimeRangeContext()
  const { checked } = useRecategorisationPreviewContext()
  const { unit, setUnit } = useCostsUnitContext()
  const { metric, setMetric } = useCostsMetricContext()
  const filters = useScalingFilterValues()

  const onMetricChange = (metric: CostsMetric) => {
    setMetric(metric)
    if (metric === 'per-l2-uop' && (range === '1d' || range === '7d')) {
      setRange('30d')
    }
  }

  const resolution = rangeToResolution(range)

  const filter = useMemo<CostsProjectsFilter>(() => {
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

  const { data, isLoading } = api.costs.chart.useQuery({
    range,
    filter,
    previewRecategorisation: checked,
  })

  const mappedMilestones = useMemo(() => {
    return mapMilestones(milestones)
  }, [milestones])

  const chartData = useMemo(() => {
    return data?.map(
      ([
        timestamp,
        overheadGas,
        overheadEth,
        overheadUsd,
        calldataGas,
        calldataEth,
        calldataUsd,
        computeGas,
        computeEth,
        computeUsd,
        blobsGas,
        blobsEth,
        blobsUsd,
      ]) => {
        const calldata =
          unit === 'usd'
            ? calldataUsd
            : unit === 'eth'
              ? calldataEth
              : calldataGas
        const blobs =
          unit === 'usd' ? blobsUsd : unit === 'eth' ? blobsEth : blobsGas
        const compute =
          unit === 'usd' ? computeUsd : unit === 'eth' ? computeEth : computeGas
        const overhead =
          unit === 'usd'
            ? overheadUsd
            : unit === 'eth'
              ? overheadEth
              : overheadGas
        const milestone = mappedMilestones[timestamp]
        return {
          timestamp,
          calldata,
          blobs,
          compute,
          overhead,
          milestone,
        }
      },
    )
  }, [data, mappedMilestones, unit])

  const chartRange = useMemo(() => newGetChartRange(chartData), [chartData])

  return (
    <section className="flex flex-col">
      <Header resolution={resolution} chartRange={chartRange} />
      <ChartContainer
        config={chartConfig}
        className="mb-2 mt-4"
        isLoading={isLoading}
        dataWithMilestones={chartData}
      >
        <AreaChart data={chartData} margin={{ top: 20 }}>
          <ChartTooltip content={<CustomTooltip unit={unit} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="calldata"
            stroke="var(--color-calldata)"
            fill="var(--color-calldata)"
            fillOpacity={1}
            strokeWidth={0}
            stackId="a"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="blobs"
            stroke="var(--color-blobs)"
            fill="var(--color-blobs)"
            fillOpacity={1}
            strokeWidth={0}
            stackId="a"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="compute"
            stroke="var(--color-compute)"
            fill="var(--color-compute)"
            fillOpacity={1}
            strokeWidth={0}
            stackId="a"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Area
            dataKey="overhead"
            stroke="var(--color-overhead)"
            fill="var(--color-overhead)"
            fillOpacity={1}
            strokeWidth={0}
            stackId="a"
            dot={false}
            isAnimationActive={false}
          />

          {getCommonChartComponents({
            chartData,
            yAxis: {
              tickFormatter: (value: number) =>
                unit === 'gas'
                  ? formatNumber(value)
                  : formatCurrency(value, unit),
            },
          })}
        </AreaChart>
      </ChartContainer>
      <ChartControlsWrapper>
        <div className="flex flex-wrap gap-1">
          <UnitControls unit={unit} setUnit={setUnit} />
          <CostsMetricControls value={metric} onValueChange={onMetricChange} />
        </div>
        <CostsChartTimeRangeControls
          timeRange={range}
          setTimeRange={setRange}
          metric={metric}
        />
      </ChartControlsWrapper>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: CostsUnit }) {
  if (!active || !payload || typeof label !== 'number') return null
  const total = payload.reduce((acc, curr) => acc + (curr?.value ?? 0), 0)
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex min-w-40 flex-col gap-1">
        <div>{formatTimestamp(label, { longMonthName: true })}</div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-secondary">
          <span>Total</span>
          <span className="whitespace-nowrap font-bold tabular-nums text-primary">
            {formatCostValue(total, unit, 'total')}
          </span>
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
                  {formatCostValue(entry.value, unit, 'total')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Header({
  resolution,
  chartRange,
}: { resolution: CostsResolution; chartRange: [number, number] | undefined }) {
  return (
    <header>
      <h1 className="text-xl font-bold first-letter:capitalize md:text-2xl">
        {resolution} onchain costs
        <span className="max-md:hidden"> stacked by type</span>
      </h1>
      <ChartTimeRange range={chartRange} />
    </header>
  )
}

function UnitControls({
  unit,
  setUnit,
}: {
  unit: CostsUnit
  setUnit: (value: CostsUnit) => void
}) {
  const loading = useChartLoading()

  return (
    <div className="flex items-center justify-between gap-2">
      {loading ? (
        <Skeleton className="h-8 w-[156px]" />
      ) : (
        <RadioGroup name="costsChartUnit" value={unit} onValueChange={setUnit}>
          <RadioGroupItem value="usd">USD</RadioGroupItem>
          <RadioGroupItem value="eth">ETH</RadioGroupItem>
          <RadioGroupItem value="gas">GAS</RadioGroupItem>
        </RadioGroup>
      )}
    </div>
  )
}
