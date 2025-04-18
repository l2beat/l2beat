'use client'

import type { Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { Checkbox } from '~/components/core/checkbox'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { formatBytes } from '~/utils/number-format/format-bytes'
import { CostsChart } from './costs-chart'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'

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
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <DataPostedCheckbox
            hasPostedData={hasPostedData}
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
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        showDataPosted={showDataPosted}
        className="mb-2 mt-4"
      />
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
      <HorizontalSeparator className="my-4" />
      <ChartStats>
        <ChartStatsItem
          label={
            range === 'max'
              ? `Total ${unitToLabel(unit)}`
              : `${rangeToLabel(range)} total ${unitToLabel(unit)}`
          }
          className="max-md:h-7"
          tooltip="The total cost for the selected time period that the project paid to Ethereum. This includes the costs for calldata, computation, blobs, and overhead."
          isLoading={isLoading}
        >
          {data?.stats.total[unit].total
            ? formatCostValue(data?.stats.total[unit].total, unit, 'total')
            : undefined}
        </ChartStatsItem>
        <ChartStatsItem
          label={`Avg ${unitToLabel(unit)} per L2 UOP`}
          tooltip="The average cost per L2 user operation for the selected time period."
          isLoading={isLoading}
          className="max-md:h-7"
        >
          {data?.stats.perL2Uop?.[unit]?.total
            ? formatCostValue(
                data.stats.perL2Uop[unit].total,
                unit,
                'per-l2-uop',
              )
            : undefined}
        </ChartStatsItem>

        <ChartStatsItem
          label={
            range === 'max'
              ? 'Total data posted'
              : `${rangeToLabel(range)} data posted`
          }
          tooltip="The total amount of data posted to Ethereum for the selected time period."
          isLoading={isLoading}
          className="max-md:h-7"
        >
          {data?.stats.total.posted
            ? formatBytes(data.stats.total.posted)
            : undefined}
        </ChartStatsItem>
        <ChartStatsItem
          label="Avg size per L2 UOP"
          tooltip="The average posted data size of a L2 user operation for the selected time period."
          isLoading={isLoading}
          className="max-md:h-7"
        >
          {data?.stats.perL2Uop?.posted
            ? formatBytes(data.stats.perL2Uop.posted)
            : undefined}
        </ChartStatsItem>
      </ChartStats>
    </div>
  )
}

function DataPostedCheckbox({
  hasPostedData,
  showDataPosted,
  setShowDataPosted,
}: {
  hasPostedData: boolean | undefined
  showDataPosted: boolean
  setShowDataPosted: (value: boolean) => void
}) {
  if (hasPostedData === undefined) {
    return <Skeleton className="h-8 w-[156px]" />
  }

  return (
    <Checkbox
      name="showDataPosted"
      checked={hasPostedData ? showDataPosted : false}
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

function rangeToLabel(range: Exclude<CostsTimeRange, 'max'>) {
  switch (range) {
    case '1d':
      return 'Past day'
    case '7d':
      return '7 days'
    case '30d':
      return '30 days'
    case '90d':
      return '90 days'
    case '180d':
      return '180 days'
    case '1y':
      return '1 year'
    default:
      assertUnreachable(range)
  }
}

function unitToLabel(unit: CostsUnit) {
  switch (unit) {
    case 'usd':
    case 'eth':
      return 'cost'
    case 'gas':
      return 'gas'
    default:
      assertUnreachable(unit)
  }
}
