'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { useCostsTimeRangeContext } from '~/app/(side-nav)/scaling/costs/_components/costs-time-range-context'
import { useCostsUnitContext } from '~/app/(side-nav)/scaling/costs/_components/costs-unit-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { type CostsProjectsFilter } from '~/server/features/scaling/costs/utils/get-costs-projects'
import { api } from '~/trpc/react'
import { useChartLoading } from '../core/chart-loading-context'
import { CostsChartHover } from './costs-chart-hover'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'
import { useCostChartRenderParams } from './use-cost-chart-render-params'

interface Props {
  entries: ScalingCostsEntry[]
  milestones: Milestone[]
}

export function ScalingCostsChart({ milestones, entries }: Props) {
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit, setUnit } = useCostsUnitContext()

  const includeFilters = useScalingFilter()
  const filters = useScalingFilterValues()

  const filteredEntries = useMemo(
    () => entries.filter((item) => includeFilters(item)),
    [entries, includeFilters],
  )

  const filter = useMemo<CostsProjectsFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'all' }
    }

    return {
      type: 'projects',
      projectIds: filteredEntries.map((project) => project.id),
    }
  }, [filteredEntries, filters])

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
    <section className="flex flex-col gap-4">
      <Header />
      <ChartProvider
        columns={columns}
        valuesStyle={valuesStyle}
        formatYAxisLabel={formatYAxisLabel}
        range={range}
        isLoading={isLoading}
        renderHoverContents={(data) => (
          <CostsChartHover data={data} unit={unit} />
        )}
      >
        <CostsChartTimeRangeControls
          timeRange={range}
          setTimeRange={setRange}
          range={chartRange}
        />
        <Chart />
        <UnitControls unit={unit} setUnit={setUnit} />
      </ChartProvider>
    </section>
  )
}

function Header() {
  return (
    <header>
      <h1 className="mb-1 text-3xl font-bold">Onchain costs</h1>
      <p className="hidden text-base text-gray-500 dark:text-gray-600 md:block">
        The page shows the costs that L2s pay to Ethereum for security. By
        default, the projects are sorted by TVL.
      </p>
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
        <RadioGroup value={unit} onValueChange={setUnit}>
          <RadioGroupItem value="usd">USD</RadioGroupItem>
          <RadioGroupItem value="eth">ETH</RadioGroupItem>
          <RadioGroupItem value="gas">GAS</RadioGroupItem>
        </RadioGroup>
      )}
    </div>
  )
}
