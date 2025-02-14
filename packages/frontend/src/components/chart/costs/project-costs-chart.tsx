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
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { useChartLoading } from '../core/chart-loading-context'
import { ProjectChartTimeRange } from '../core/chart-time-range'
import { newGetChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'
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
  const chartRange = useMemo(() => newGetChartRange(chartData), [chartData])

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
        milestones={mappedMilestones}
        resolution={rangeToResolution(range)}
        className="mb-2 mt-4"
      />
      <UnitControls unit={unit} setUnit={setUnit} />
    </div>
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
