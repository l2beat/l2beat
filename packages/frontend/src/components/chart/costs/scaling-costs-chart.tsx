'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import {
  type CostsMetric,
  useCostsMetricContext,
} from '~/app/(side-nav)/scaling/costs/_components/costs-metric-context'
import { useCostsTimeRangeContext } from '~/app/(side-nav)/scaling/costs/_components/costs-time-range-context'
import { CostsMetricControls } from '~/app/(side-nav)/scaling/costs/_components/costs-type-controls'
import { useCostsUnitContext } from '~/app/(side-nav)/scaling/costs/_components/costs-unit-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { type CostsProjectsFilter } from '~/server/features/scaling/costs/utils/get-costs-projects'
import {
  type CostsResolution,
  rangeToResolution,
} from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { useChartLoading } from '../core/chart-loading-context'
import { ChartTimeRange } from '../core/chart-time-range'
import { CostsChartHover } from './costs-chart-hover'
import { CostsChartLegend } from './costs-chart-legend'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'
import { useCostChartRenderParams } from './use-cost-chart-render-params'

interface Props {
  tab: Exclude<CostsProjectsFilter['type'], 'all' | 'projects'>
  entries: ScalingCostsEntry[]
  milestones: Milestone[]
}

export function ScalingCostsChart({ tab, milestones, entries }: Props) {
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit, setUnit } = useCostsUnitContext()
  const { metric, setMetric } = useCostsMetricContext()
  const filters = useScalingFilterValues()

  const onMetricChange = (metric: CostsMetric) => {
    setMetric(metric)
    if (metric === 'per-l2-tx' && (range === '1d' || range === '7d')) {
      setRange('30d')
    }
  }

  const includeFilters = useScalingFilter()
  const resolution = rangeToResolution(range)

  const filteredEntries = useMemo(
    () => entries.filter((item) => includeFilters(item)),
    [entries, includeFilters],
  )

  const filter = useMemo<CostsProjectsFilter>(() => {
    if (filters.isEmpty) {
      return {
        type: tab,
      }
    }

    return {
      type: 'projects',
      projectIds: filteredEntries.map((project) => project.id),
    }
  }, [filteredEntries, filters.isEmpty, tab])

  const { data, isLoading } = api.costs.chart.useQuery({
    range,
    filter,
  })

  const { chartRange, columns, formatYAxisLabel, valuesStyle } =
    useCostChartRenderParams({
      data,
      milestones,
      unit,
    })

  return (
    <section className="flex flex-col">
      <ChartProvider
        columns={columns}
        valuesStyle={valuesStyle}
        formatYAxisLabel={formatYAxisLabel}
        range={range}
        isLoading={isLoading}
        renderHoverContents={(data) => (
          <CostsChartHover data={data} unit={unit} resolution={resolution} />
        )}
      >
        <Header resolution={resolution} chartRange={chartRange} />
        <Chart className="mt-4" />
        <CostsChartLegend className="my-2" />
        <ChartControlsWrapper>
          <div className="flex flex-wrap gap-1">
            <UnitControls unit={unit} setUnit={setUnit} />
            <CostsMetricControls
              value={metric}
              onValueChange={onMetricChange}
            />
          </div>
          <CostsChartTimeRangeControls
            timeRange={range}
            setTimeRange={setRange}
            metric={metric}
          />
        </ChartControlsWrapper>
      </ChartProvider>
    </section>
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
