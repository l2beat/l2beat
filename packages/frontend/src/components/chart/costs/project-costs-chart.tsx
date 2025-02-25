'use client'

import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
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
  const [showPosted, setShowPosted] = useState(false)

  const resolution = rangeToResolution(range)

  const { data: costsData, isLoading: isCostsLoading } =
    api.costs.chart.useQuery({
      range,
      filter: { type: 'projects', projectIds: [projectId] },
    })
  const { data: daData, isLoading: isDaLoading } = api.da.projectChart.useQuery(
    {
      range,
      projectId,
    },
  )
  const timestampedDaData = Object.fromEntries(daData ?? [])
  const chartData = useMemo(() => {
    if (!costsData) {
      return undefined
    }
    return costsData?.map(
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
  }, [costsData, unit])

  const scale = useMemo(() => {
    if (!chartData) return undefined
    const minDaTimestamp = Math.min(
      ...Object.keys(timestampedDaData).map(Number),
    )
    const maxDaValue = Math.max(...Object.values(timestampedDaData))
    const maxCostValue = Math.max(
      ...chartData
        .filter((p) => p.timestamp >= minDaTimestamp)
        .map(
          (point) =>
            point.calldata +
            point.overhead +
            point.compute +
            (point.blobs ?? 0),
        ),
    )
    const scale = maxCostValue / maxDaValue
    return resolution === 'daily' ? scale : scale * 24
  }, [chartData, resolution, timestampedDaData])

  const chartDataWithPosted = useMemo(() => {
    if (!timestampedDaData || scale === undefined) {
      return
    }

    return chartData?.map((point) => {
      const dailyTimestamp = new UnixTime(point.timestamp).toStartOf('day')
      const posted = timestampedDaData[dailyTimestamp.toNumber()]
      return {
        ...point,
        posted: posted
          ? resolution === 'daily'
            ? posted * scale
            : (posted / 24) * scale
          : null,
      }
    })
  }, [chartData, resolution, scale, timestampedDaData])

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])
  const isLoading = isCostsLoading || isDaLoading

  return (
    <div>
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <Checkbox
            name="showMainnetActivity"
            checked={showPosted}
            onCheckedChange={(state) => setShowPosted(!!state)}
          >
            Show maximum
          </Checkbox>
          <CostsChartTimeRangeControls
            projectSection
            timeRange={range}
            setTimeRange={setRange}
          />
        </div>
      </div>
      <CostsChart
        data={chartDataWithPosted}
        unit={unit}
        isLoading={isLoading}
        milestones={milestones}
        resolution={resolution}
        showPosted={showPosted}
        className="mb-2 mt-4"
        daScale={scale}
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
