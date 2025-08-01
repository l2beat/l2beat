import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { CostsChart } from './CostsChart'
import { CostsChartTimeRangeControls } from './CostsChartTimeRangeControls'
import { ProjectCostsChartStats } from './ProjectCostsChartStats'

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
  const [showDataPosted, setShowDataPosted] = useState(false)

  const { data, isLoading } = api.costs.projectChart.useQuery({
    range,
    projectId,
  })

  const chartData = useMemo(() => {
    if (!data) {
      return undefined
    }

    const lastDataPosted = data.chart.findLast((d) => d[13])
    const allDataPostedSynced = data.chart.at(-1)?.[0] === lastDataPosted?.[0]

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
          posted,
          estimatedPosted:
            !allDataPostedSynced &&
            lastDataPosted &&
            timestamp <= data.syncedUntil &&
            timestamp >= lastDataPosted[0]
              ? (lastDataPosted[13] ?? null)
              : null,
        }
      },
    )
  }, [data, unit])

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <div className={cn('mt-4 mb-3 flex flex-col justify-between gap-1')}>
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <DataPostedCheckbox
            isLoading={isLoading}
            disabled={!hasPostedData}
            showDataPosted={showDataPosted}
            setShowDataPosted={setShowDataPosted}
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
        syncedUntil={data?.syncedUntil}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        showDataPosted={hasPostedData ? showDataPosted : false}
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

function DataPostedCheckbox({
  disabled,
  showDataPosted,
  setShowDataPosted,
  isLoading,
}: {
  disabled: boolean
  showDataPosted: boolean
  setShowDataPosted: (value: boolean) => void
  isLoading?: boolean
}) {
  if (isLoading) {
    return <Skeleton className="h-8 w-[168px]" />
  }

  return (
    <Checkbox
      name="showDataPosted"
      checked={disabled ? false : showDataPosted}
      onCheckedChange={(state) => setShowDataPosted(!!state)}
      disabled={disabled}
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
