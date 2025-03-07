'use client'

import type { Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { Checkbox } from '~/components/core/checkbox'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { formatNumber } from '~/utils/number-format/format-number'
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
      <ChartStats columns={3}>
        <ChartStatsItem
          label={
            range === 'max' ? 'Total cost' : `${rangeToLabel(range)} total cost`
          }
          value={
            data?.stats.totalCosts[unit].total
              ? formatCostValue(
                  data?.stats.totalCosts[unit].total,
                  unit,
                  'total',
                )
              : undefined
          }
          isLoading={isLoading}
        />
        <ChartStatsItem
          label="Avg cost per L2 UOP"
          value={
            data?.stats.perL2UopCost?.[unit]?.total &&
            range !== '1d' &&
            range !== '7d'
              ? formatCostValue(
                  data.stats.perL2UopCost[unit].total,
                  unit,
                  'per-l2-uop',
                )
              : undefined
          }
          isLoading={isLoading}
          className="md:max-lg:items-center"
        />
        <ChartStatsItem
          label={
            range === 'max'
              ? 'Total UOPS count'
              : `${rangeToLabel(range)} UOPS count`
          }
          value={
            data?.stats.uopsCount
              ? formatNumber(data?.stats.uopsCount)
              : undefined
          }
          isLoading={isLoading}
          className="md:max-lg:items-end"
        />
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

function rangeToLabel(range: Exclude<CostsTimeRange, 'max'>) {
  switch (range) {
    case '1d':
      return 'Past day'
    case '7d':
    case '30d':
    case '90d':
    case '180d':
    case '1y':
      return range.toUpperCase()
    default:
      assertUnreachable(range)
  }
}
