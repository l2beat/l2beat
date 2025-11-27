import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { CostsChart } from './CostsChart'
import { CostsChartRangeControls } from './CostsChartRangeControls'
import { ProjectCostsChartStats } from './ProjectCostsChartStats'

interface Props {
  milestones: Milestone[]
  project: ChartProject
  defaultRange: ChartRange
}

export function ProjectCostsChart({
  milestones,
  project,
  defaultRange,
}: Props) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [unit, setUnit] = useState<CostsUnit>('usd')

  const { data, isLoading } = api.costs.projectChart.useQuery({
    range,
    projectId: project.id,
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
        ethereum,
        celestia,
        avail,
        eigenda,
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
          ethereum,
          celestia,
          avail,
          eigenda,
        }
      },
    )
  }, [data, unit])

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <div>
      <div className="mt-4 mb-3 flex justify-between gap-1">
        <ProjectChartTimeRange timeRange={timeRange} />
        <CostsChartRangeControls
          range={range}
          setRange={setRange}
        />
      </div>
      <CostsChart
        project={project}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        hasBlobs={!!data?.hasBlobs}
        tickCount={4}
        className="mt-4 mb-3"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
      <HorizontalSeparator className="my-4" />
      <ProjectCostsChartStats data={data} isLoading={isLoading} unit={unit} />
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
