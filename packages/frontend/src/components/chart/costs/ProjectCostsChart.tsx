import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { getLastValidTimestamp } from '../utils/getLastValidTimestamp'
import { CostsChart } from './CostsChart'
import { CostsChartTimeRangeControls } from './CostsChartTimeRangeControls'
import { ProjectCostsChartStats } from './ProjectCostsChartStats'

interface Props {
  milestones: Milestone[]
  projectId: string
  defaultRange: CostsTimeRange
}

export function ProjectCostsChart({
  milestones,
  projectId,
  defaultRange,
}: Props) {
  const [range, setRange] = useState<CostsTimeRange>(defaultRange)
  const [unit, setUnit] = useState<CostsUnit>('usd')

  const { data, isLoading } = api.costs.projectChart.useQuery({
    range,
    projectId,
  })

  const chartData = useMemo(() => {
    if (!data) {
      return undefined
    }

    return data.chart.map(
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

  const lastValidTimestamp = useMemo(
    () => getLastValidTimestamp(data?.chart),
    [data?.chart],
  )

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <div className={cn('mt-4 mb-3 flex justify-between gap-1')}>
        <ProjectChartTimeRange range={chartRange} />

        <CostsChartTimeRangeControls
          projectSection
          timeRange={range}
          setTimeRange={setRange}
        />
      </div>
      <CostsChart
        data={chartData}
        lastValidTimestamp={lastValidTimestamp}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        hasBlobs={!!data?.hasBlobs}
        tickCount={4}
        className="mt-4 mb-2"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
      <HorizontalSeparator className="my-4" />
      <ProjectCostsChartStats
        data={data}
        isLoading={isLoading}
        range={range}
        unit={unit}
      />
    </div>
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
        <Skeleton className="h-8 w-[168px]" />
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
