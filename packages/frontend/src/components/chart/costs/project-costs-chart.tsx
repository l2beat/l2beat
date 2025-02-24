'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import {
  type CostsTimeRange,
  rangeToResolution,
} from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { ChartControlsWrapper } from '../../core/chart/chart-controls-wrapper'
import { ProjectChartTimeRange } from '../../core/chart/chart-time-range'
import { getChartRange } from '../../core/chart/utils/get-chart-range-from-columns'
import { CostsChart } from './costs-chart'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'

interface Props {
  milestones: Milestone[]
  projectId: string
}

export function ProjectCostsChart({ milestones, projectId }: Props) {
  const [range, setRange] = useState<CostsTimeRange>('1y')
  const [unit, setUnit] = useState<CostsUnit>('usd')
  const { data, isLoading } = api.costs.chart.useQuery({
    range,
    filter: { type: 'projects', projectIds: [projectId] },
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
        return {
          timestamp,
          calldata,
          blobs,
          compute,
          overhead,
        }
      },
    )
  }, [data, unit])
  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <CostsChartTimeRangeControls
          projectSection
          timeRange={range}
          setTimeRange={setRange}
        />
      </ChartControlsWrapper>
      <CostsChart
        data={chartData}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        resolution={rangeToResolution(range)}
        className="mb-2 mt-4"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
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
