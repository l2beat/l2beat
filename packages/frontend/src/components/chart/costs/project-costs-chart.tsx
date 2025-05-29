import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { Checkbox } from '~/components/core/checkbox'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { CostsChart } from './costs-chart'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'
import { ProjectCostsChartStats } from './project-costs-chart-stats'

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
          posted: posted ?? null,
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
          'mb-3 mt-4 flex flex-col justify-between gap-1',
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
        className="mb-2 mt-4"
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
