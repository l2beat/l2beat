'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { rangeToResolution } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
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
  const [showDataPosted, setShowDataPosted] = useState(false)

  const resolution = rangeToResolution(range)

  const { data, isLoading } = api.costs.chartWithDataPosted.useQuery({
    range,
    projectId,
  })

  const chartData = useMemo(() => {
    if (!data) {
      return undefined
    }

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
        posted,
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
          posted: posted ?? null,
        }
      },
    )
  }, [data, unit])

  const hasPostedData = !!chartData?.some((cost) => cost.posted !== null)

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <DataPostedCheckbox
            hasPostedData={hasPostedData}
            showDataPosted={showDataPosted}
            setShowDataPosted={setShowDataPosted}
            isLoading={isLoading}
          />
          <CostsChartTimeRangeControls
            projectSection
            timeRange={range}
            setTimeRange={setRange}
          />
        </div>
      </div>
      <CostsChart
        data={chartData}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        resolution={resolution}
        showDataPosted={showDataPosted}
        className="mb-2 mt-4"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
    </div>
  )
}

function DataPostedCheckbox({
  hasPostedData,
  showDataPosted,
  setShowDataPosted,
  isLoading,
}: {
  hasPostedData: boolean
  showDataPosted: boolean
  setShowDataPosted: (value: boolean) => void
  isLoading: boolean
}) {
  if (isLoading) {
    return <Skeleton className="h-8 w-[156px]" />
  }

  return (
    <Checkbox
      name="showDataPosted"
      checked={showDataPosted}
      onCheckedChange={(state) => setShowDataPosted(!!state)}
      disabled={!hasPostedData}
      labelTitle={!hasPostedData ? 'No data' : undefined}
    >
      Show data posted
    </Checkbox>
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
