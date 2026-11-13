import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartPreviousDataDim } from '~/components/core/chart/ChartPreviousData'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { formatCostValue } from '~/pages/layer2s/costs/utils/formatCostValue'
import type { CostsUnit } from '~/server/features/layer2s/costs/types'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import {
  ChartInsight,
  type ChartInsightPart,
  formatShare,
} from '../ChartInsight'
import { tvsRangeToReadable } from '../tvs/tvsRangeToReadable'
import { COST_PARTS, CostsChart } from './CostsChart'
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
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [unit, setUnit] = useState<CostsUnit>('usd')

  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.costs.projectChart,
    { range, projectId: project.id },
  )

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
        }
      },
    )
  }, [data, unit])

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(chartData, {
        bucket: rangeToResolution(shownInput.range),
      }),
    [chartData, shownInput.range],
  )

  const insightParts = useMemo(
    () =>
      COST_PARTS.map((part): ChartInsightPart => {
        const value = (chartData ?? []).reduce(
          (sum, point) => sum + (point[part.key] ?? 0),
          0,
        )
        return {
          ...part,
          value,
          formattedValue: formatCostValue(value, unit),
        }
      }),
    [chartData, unit],
  )
  const total = data?.stats?.total[unit]

  return (
    <div>
      {(isLoading || total !== undefined) && (
        <ChartInsight
          className="mb-5"
          eyebrow={`Paid to Ethereum · ${tvsRangeToReadable(shownInput.range)}`}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          headline={
            total !== undefined &&
            costsHeadline(
              project.shortName ?? project.name,
              formatCostValue(total, unit),
              unit,
              insightParts,
            )
          }
          parts={insightParts}
        />
      )}
      <div className="mt-4 mb-3 flex justify-between gap-1">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <CostsChartRangeControls range={range} setRange={setRange} />
      </div>
      <div className="mt-4 mb-3">
        <CostsChart
          isPlaceholderData={isPlaceholderData}
          project={project}
          data={chartData}
          syncedUntil={data?.syncedUntil}
          unit={unit}
          isLoading={isLoading}
          milestones={milestones}
          range={shownInput.range}
          hasBlobs={!!data?.hasBlobs}
          tickCount={4}
        />
      </div>
      <UnitControls unit={unit} setUnit={setUnit} isLoading={isLoading} />
      <ChartPreviousDataDim
        isPlaceholderData={isPlaceholderData}
        className="mt-4"
      >
        <ProjectCostsChartStats data={data} isLoading={isLoading} unit={unit} />
      </ChartPreviousDataDim>
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

/** The period's total and the part that took most of it. */
function costsHeadline(
  name: string,
  total: string,
  unit: CostsUnit,
  parts: ChartInsightPart[],
) {
  const sum = parts.reduce((acc, part) => acc + part.value, 0)
  const largest = parts.reduce((a, b) => (b.value > a.value ? b : a))
  const paid =
    unit === 'gas' ? (
      <>
        {name} used <strong>{total}</strong> gas on Ethereum
      </>
    ) : (
      <>
        {name} paid <strong>{total}</strong> to Ethereum
      </>
    )
  if (sum <= 0) return paid
  return (
    <>
      {paid}, <strong>{formatShare(largest.value / sum)}</strong> of it for{' '}
      {largest.label.toLowerCase()}
    </>
  )
}
