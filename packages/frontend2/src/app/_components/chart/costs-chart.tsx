'use client'

import { type Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { useCostsMetricContext } from '~/app/(new)/(other)/scaling/costs/_components/costs-metric-context'
import { useCostsTimeRangeContext } from '~/app/(new)/(other)/scaling/costs/_components/costs-time-range-context'
import { useCostsUnitContext } from '~/app/(new)/(other)/scaling/costs/_components/costs-unit-context'
import { formatCostValue } from '~/app/(new)/(other)/scaling/costs/_utils/format-cost-value'
import { ChartTimeRangeControls } from '~/app/_components/chart/controls/chart-time-range-controls'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type CostsChartResponse } from '~/server/features/costs/types'
import { type CostsUnit } from '~/server/features/scaling/get-scaling-costs-entries'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/format'
import { formatNumber } from '~/utils/format-number'
import { HorizontalSeparator } from '../horizontal-separator'
import { Square } from '../square'
import { useChartLoading } from './core/chart-loading-context'
import { mapMilestones } from './utils/map-milestones'

interface CostsChartPointData {
  timestamp: number
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}
interface Props {
  milestones: Milestone[]
  tag?: string
}

const DENCUN_UPGRADE_TIMESTAMP = 1710288000

export function CostsChart({ milestones, tag = 'costs' }: Props) {
  const { range, setRange } = useCostsTimeRangeContext()
  const { metric } = useCostsMetricContext()
  const { unit, setUnit } = useCostsUnitContext()
  const [scale, setScale] = useLocalStorage(`${tag}-scale`, 'lin')

  const { data: chart } = api.scaling.costs.chart.useQuery({
    range,
  })

  const mappedMilestones = mapMilestones(milestones)

  const formatYAxisLabel = (value: number) =>
    unit === 'gas'
      ? formatNumber(value)
      : formatCurrency(value, unit, { showLessThanMinimum: false })

  const columns = useMemo(
    () =>
      chart?.data.map((dataPoint) => {
        const [timestamp] = dataPoint

        return {
          values: getValues(dataPoint, unit),
          data: getData(dataPoint, unit),
          milestone: mappedMilestones[timestamp],
        }
      }) ?? [],
    [chart?.data, mappedMilestones, unit],
  )

  const rangeStart = chart?.data[0]?.[0] ?? 0
  const rangeEnd = chart?.data[chart.data.length - 1]?.[0] ?? 1

  return (
    <section className="flex flex-col gap-4">
      <Header />
      <ChartProvider
        columns={columns}
        valuesStyle={[
          {
            line: 'blue',
            fill: 'blue',
            point: 'circle',
          },
          {
            line: 'light-yellow',
            fill: 'light-yellow',
          },
          {
            line: 'pink',
            fill: 'pink',
          },
          {
            line: 'purple',
            fill: 'purple',
          },
        ]}
        formatYAxisLabel={formatYAxisLabel}
        range={[rangeStart, rangeEnd]}
        useLogScale={scale === 'log'}
        renderHoverContents={(data) => <ChartHover data={data} unit={unit} />}
      >
        <ChartTimeRangeControls
          value={range}
          setValue={setRange}
          options={[
            {
              value: '1d',
              label: '1D',
              disabled: metric === 'per-l2-tx',
            },
            {
              value: '7d',
              label: '7D',
              disabled: metric === 'per-l2-tx',
            },
            {
              value: '30d',
              label: '30D',
            },
            {
              value: '90d',
              label: '90D',
            },
            {
              value: '180d',
              label: '180D',
            },
          ]}
          range={[rangeStart, rangeEnd]}
        />
        <Chart />
        <UnitAndScaleControls
          unit={unit}
          scale={scale}
          setUnit={setUnit}
          setScale={setScale}
        />
      </ChartProvider>
    </section>
  )
}

function ChartHover({
  data,
  unit,
}: { data: CostsChartPointData; unit: CostsUnit }) {
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">Total</span>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.total, unit)}
        </span>
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="calldata" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Calldata
          </span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.calldata, unit)}
        </span>
      </div>
      {data.blobs ? (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Square variant="blobs" />
            <span className="text-sm text-gray-700 dark:text-gray-50">
              Blobs
            </span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {formatCostValue(data.blobs, unit)}
          </span>
        </div>
      ) : null}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="compute" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Compute
          </span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.compute, unit)}
        </span>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="overhead" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Overhead
          </span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.overhead, unit)}
        </span>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header>
      <h1 className="mb-1 text-3xl font-bold">Onchain costs</h1>
      <p className="hidden text-base text-gray-500 dark:text-gray-600 md:block">
        The page shows the costs that L2s pay to Ethereum for security. By
        default, the projects are sorted by TVL.
      </p>
    </header>
  )
}

function UnitAndScaleControls({
  unit,
  scale,
  setUnit,
  setScale,
}: {
  unit: CostsUnit
  scale: string
  setUnit: (value: CostsUnit) => void
  setScale: (value: string) => void
}) {
  const loading = useChartLoading()

  if (loading) {
    return (
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-[104.82px]" />
        <Skeleton className="h-8 w-[98.63px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <RadioGroup value={unit} onValueChange={setUnit}>
        <RadioGroupItem value="usd">USD</RadioGroupItem>
        <RadioGroupItem value="eth">ETH</RadioGroupItem>
        <RadioGroupItem value="gas">GAS</RadioGroupItem>
      </RadioGroup>
      <RadioGroup value={scale} onValueChange={setScale}>
        <RadioGroupItem value="log">LOG</RadioGroupItem>
        <RadioGroupItem value="lin">LIN</RadioGroupItem>
      </RadioGroup>
    </div>
  )
}

function getValues(
  dataPoint: CostsChartResponse['data'][number],
  unit: CostsUnit,
) {
  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
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
  ] = dataPoint
  switch (unit) {
    case 'usd':
      return [
        { value: overheadUsd + computeUsd + (blobsUsd ?? 0) + calldataUsd },
        { value: overheadUsd + computeUsd + (blobsUsd ?? 0) },
        { value: overheadUsd + computeUsd },
        { value: overheadUsd },
      ]
    case 'eth':
      return [
        { value: overheadEth + computeEth + (blobsEth ?? 0) + calldataEth },
        { value: overheadEth + computeEth + (blobsEth ?? 0) },
        { value: overheadEth + computeEth },
        { value: overheadEth },
      ]
    case 'gas':
      return [
        { value: overheadGas + computeGas + (blobsGas ?? 0) + calldataGas },
        { value: overheadGas + computeGas + (blobsGas ?? 0) },
        { value: overheadGas + computeGas },
        { value: overheadGas },
      ]
    default:
      assertUnreachable(unit)
  }
}

function getData(
  dataPoint: CostsChartResponse['data'][number],
  unit: CostsUnit,
): CostsChartPointData {
  const [
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
  ] = dataPoint

  const isPostDencun = timestamp >= DENCUN_UPGRADE_TIMESTAMP
  switch (unit) {
    case 'usd':
      return {
        timestamp,
        total: calldataUsd + computeUsd + (blobsUsd ?? 0) + overheadUsd,
        calldata: calldataUsd,
        blobs: isPostDencun && blobsUsd && blobsUsd > 0 ? blobsUsd : undefined,
        compute: computeUsd,
        overhead: overheadUsd,
      }
    case 'eth':
      return {
        timestamp,
        total: calldataEth + computeEth + (blobsEth ?? 0) + overheadEth,
        calldata: calldataEth,
        blobs: isPostDencun && blobsEth && blobsEth > 0 ? blobsEth : undefined,
        compute: computeEth,
        overhead: overheadEth,
      }
    case 'gas':
      return {
        timestamp,
        total: calldataGas + computeGas + (blobsGas ?? 0) + overheadGas,
        calldata: calldataGas,
        blobs: isPostDencun && blobsGas && blobsGas > 0 ? blobsGas : undefined,
        compute: computeGas,
        overhead: overheadGas,
      }
  }
}
