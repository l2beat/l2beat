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
import { CostsChart } from './CostsChart'
import { CostsChartTimeRangeControls } from './CostsChartTimeRangeControls'
import { ProjectCostsChartStats } from './ProjectCostsChartStats'
import { ProjectDataPostedChart } from './ProjectDataPostedChart'

interface Props {
  milestones: Milestone[]
  projectId: string
  defaultRange: CostsTimeRange
  hasPostedData: boolean
}

export function ProjectCostsChart({
  milestones,
  projectId,
  defaultRange,
  hasPostedData,
}: Props) {
  const [range, setRange] = useState<CostsTimeRange>(defaultRange)
  const [unit, setUnit] = useState<CostsUnit>('usd')

  const { data, isLoading } = api.costs.projectChart.useQuery({
    range,
    projectId,
  })

  const costsChartData = useMemo(() => {
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

  const dataPostedChartData = useMemo(() => {
    if (!data) {
      return undefined
    }

    const lastDataPosted = data.chart.findLast((d) => d[13])
    const allDataPostedSynced = data.chart.at(-1)?.[0] === lastDataPosted?.[0]

    return data.chart.map((dataPoint) => {
      const timestamp = dataPoint[0]
      const posted = dataPoint[13]

      return {
        timestamp,
        posted: posted ?? 0,
        notSyncedPosted:
          !allDataPostedSynced &&
          lastDataPosted &&
          timestamp >= lastDataPosted[0]
            ? (lastDataPosted[13] ?? 0)
            : null,
      }
    })
  }, [data])

  const chartRange = useMemo(
    () => getChartRange(costsChartData),
    [costsChartData],
  )

  return (
    <div>
      <div className="mt-4 mb-3 flex justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <CostsChartTimeRangeControls
          projectSection
          timeRange={range}
          setTimeRange={setRange}
        />
      </div>
      <CostsChart
        data={costsChartData}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        tickCount={4}
        className="mt-4 mb-2"
      />
      <ProjectDataPostedChart
        data={dataPostedChartData}
        isLoading={isLoading}
        className="mt-4 mb-2"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
      <HorizontalSeparator className="my-4" />
      <ProjectCostsChartStats
        data={data}
        isLoading={isLoading}
        range={range}
        unit={unit}
        hasPostedData={hasPostedData}
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
