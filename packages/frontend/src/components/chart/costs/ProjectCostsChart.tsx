import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
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
}

export function ProjectCostsChart({ milestones, projectId }: Props) {
  const [range, setRange] = useState<CostsTimeRange>('1y')
  const [unit, setUnit] = useState<CostsUnit>('usd')
  const [showDataPosted, setShowDataPosted] = useState(true)

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
          notSyncedPosted:
            !allDataPostedSynced &&
            lastDataPosted &&
            timestamp >= lastDataPosted[0]
              ? lastDataPosted[13]
              : null,
        }
      },
    )
  }, [data, unit])

  const hasPostedData = chartData?.some((cost) => cost.posted !== null)

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <div
        className={cn(
          'mt-4 mb-3 flex flex-col justify-between gap-1',
          !hasPostedData && 'flex-row',
        )}
      >
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          {hasPostedData && (
            <DataPostedCheckbox
              showDataPosted={showDataPosted}
              setShowDataPosted={setShowDataPosted}
            />
          )}
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
        range={range}
        showDataPosted={hasPostedData ? showDataPosted : false}
        className="mt-4 mb-2"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
      <HorizontalSeparator className="my-4" />
      {data && (
        <ProjectCostsChartStats
          data={data}
          isLoading={isLoading}
          range={range}
          unit={unit}
          hasPostedData={hasPostedData}
        />
      )}
    </div>
  )
}

function DataPostedCheckbox({
  showDataPosted,
  setShowDataPosted,
}: {
  showDataPosted: boolean
  setShowDataPosted: (value: boolean) => void
}) {
  return (
    <Checkbox
      name="showDataPosted"
      checked={showDataPosted}
      onCheckedChange={(state) => setShowDataPosted(!!state)}
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
