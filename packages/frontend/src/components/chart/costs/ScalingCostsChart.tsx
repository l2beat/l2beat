import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import {
  type CostsMetric,
  useCostsMetricContext,
} from '~/pages/scaling/costs/components/CostsMetricContext'
import { useCostsTimeRangeContext } from '~/pages/scaling/costs/components/CostsTimeRangeContext'
import { CostsMetricControls } from '~/pages/scaling/costs/components/CostsTypeControls'
import { useCostsUnitContext } from '~/pages/scaling/costs/components/CostsUnitContext'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/getScalingCostsEntries'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsProjectsFilter } from '~/server/features/scaling/costs/utils/getCostsProjects'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { CostsChart } from './CostsChart'
import { CostsChartTimeRangeControls } from './CostsChartTimeRangeControls'

interface Props {
  tab: Exclude<CostsProjectsFilter['type'], 'all' | 'projects'>
  entries: ScalingCostsEntry[]
  milestones: Milestone[]
}

export function ScalingCostsChart({ tab, milestones, entries }: Props) {
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit, setUnit } = useCostsUnitContext()
  const { metric, setMetric } = useCostsMetricContext()
  const { state: filters } = useTableFilterContext()

  const onMetricChange = (metric: CostsMetric) => {
    setMetric(metric)
    if (metric === 'per-l2-uop' && (range === '1d' || range === '7d')) {
      setRange('30d')
    }
  }

  const filter = useMemo<CostsProjectsFilter>(() => {
    if (Object.keys(filters).length === 0) {
      return {
        type: tab,
      }
    }

    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries, filters, tab])

  const { data, isLoading } = api.costs.chart.useQuery({
    range,
    filter,
  })

  const chartData = useMemo(() => {
    return data?.chart.map(
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
    <div>
      <Header chartRange={chartRange} />
      <CostsChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        showDataPosted={false}
        hasBlobs={!!data?.hasBlobs}
        className="mt-4 mb-2"
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
    </div>
  )
}

function Header({ chartRange }: { chartRange: [number, number] | undefined }) {
  return (
    <header>
      <h1 className="font-bold text-xl md:text-2xl">
        Onchain costs
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
