'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useScalingFilterValues } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import type { CostsMetric } from '~/app/(side-nav)/scaling/costs/_components/costs-metric-context'
import { useCostsMetricContext } from '~/app/(side-nav)/scaling/costs/_components/costs-metric-context'
import { useCostsTimeRangeContext } from '~/app/(side-nav)/scaling/costs/_components/costs-time-range-context'
import { CostsMetricControls } from '~/app/(side-nav)/scaling/costs/_components/costs-type-controls'
import { useCostsUnitContext } from '~/app/(side-nav)/scaling/costs/_components/costs-unit-context'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsProjectsFilter } from '~/server/features/scaling/costs/utils/get-costs-projects'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import { rangeToResolution } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { ChartControlsWrapper } from '../../core/chart/chart-controls-wrapper'
import { ChartTimeRange } from '../../core/chart/chart-time-range'
import { getChartRange } from '../../core/chart/utils/get-chart-range-from-columns'
import { CostsChart } from './costs-chart'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'

interface Props {
  tab: Exclude<CostsProjectsFilter['type'], 'all' | 'projects'>
  entries: ScalingCostsEntry[]
  milestones: Milestone[]
}

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
        return {
          timestamp,
          calldata:
            unit === 'usd'
              ? calldataUsd
              : unit === 'eth'
                ? calldataEth
                : calldataGas,
          blobs:
            unit === 'usd' ? blobsUsd : unit === 'eth' ? blobsEth : blobsGas,
          compute:
            unit === 'usd'
              ? computeUsd
              : unit === 'eth'
                ? computeEth
                : computeGas,
          overhead:
            unit === 'usd'
              ? overheadUsd
              : unit === 'eth'
                ? overheadEth
                : overheadGas,
        }
      },
    )
  }, [data, unit])

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <section>
      <Header resolution={resolution} chartRange={chartRange} />
      <CostsChart
        data={chartData}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        resolution={resolution}
        className="mb-2 mt-4"
      />
      <ChartControlsWrapper>
        <div className="flex flex-wrap gap-1">
          <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
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
  isLoading,
}: {
  unit: CostsUnit
  setUnit: (value: CostsUnit) => void
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      {isLoading ? (
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
