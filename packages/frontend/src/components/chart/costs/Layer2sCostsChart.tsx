import type { Milestone } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import {
  type CostsMetric,
  useCostsMetricContext,
} from '~/pages/layer2s/costs/components/CostsMetricContext'
import { useCostsTimeRangeContext } from '~/pages/layer2s/costs/components/CostsTimeRangeContext'
import { CostsMetricControls } from '~/pages/layer2s/costs/components/CostsTypeControls'
import { useCostsUnitContext } from '~/pages/layer2s/costs/components/CostsUnitContext'
import type { Layer2sCostsEntry } from '~/server/features/layer2s/costs/getLayer2sCostsEntries'
import type { CostsUnit } from '~/server/features/layer2s/costs/types'
import type { CostsProjectsFilter } from '~/server/features/layer2s/costs/utils/getCostsProjects'
import { useTRPC } from '~/trpc/React'
import { optionToRange, rangeToResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import { CostsChart } from './CostsChart'
import { CostsChartRangeControls } from './CostsChartRangeControls'

interface Props {
  tab: Exclude<CostsProjectsFilter['type'], 'all' | 'projects'>
  entries: Layer2sCostsEntry[]
  milestones: Milestone[]
}

export function Layer2sCostsChart({ tab, milestones, entries }: Props) {
  const trpc = useTRPC()
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit, setUnit } = useCostsUnitContext()
  const { metric, setMetric } = useCostsMetricContext()
  const { state: filters } = useTableFilterContext()

  const onMetricChange = (metric: CostsMetric) => {
    setMetric(metric)
    const days = rangeToDays(range)
    if (
      metric === 'per-l2-uop' &&
      days !== null &&
      (days === 1 || days === 7)
    ) {
      setRange(optionToRange('30d'))
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

  const { data, isLoading } = useQuery(
    trpc.costs.chart.queryOptions({
      range,
      filter,
    }),
  )

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

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(chartData, {
        bucket: rangeToResolution(range),
      }),
    [chartData, range],
  )

  return (
    <div>
      <Header timeRange={timeRange} />
      <div className="mt-4 mb-3">
        <CostsChart
          data={chartData}
          syncedUntil={data?.syncedUntil}
          unit={unit}
          isLoading={isLoading}
          milestones={milestones}
          range={range}
          hasBlobs={!!data?.hasBlobs}
        />
      </div>
      <ChartControlsWrapper>
        <div className="flex flex-wrap gap-1">
          <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
          <CostsMetricControls value={metric} onValueChange={onMetricChange} />
        </div>
        <CostsChartRangeControls
          range={range}
          setRange={setRange}
          metric={metric}
        />
      </ChartControlsWrapper>
    </div>
  )
}

function Header({ timeRange }: { timeRange: [number, number] | undefined }) {
  return (
    <header>
      <h2 className="font-bold text-xl md:text-2xl">
        Onchain costs
        <span className="max-md:hidden"> stacked by type</span>
      </h2>
      <ChartTimeRange timeRange={timeRange} />
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
