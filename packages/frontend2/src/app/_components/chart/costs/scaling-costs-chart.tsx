'use client'

import { type Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import React from 'react'
import { useCostsTimeRangeContext } from '~/app/(new)/(other)/scaling/costs/_components/costs-time-range-context'
import { useCostsUnitContext } from '~/app/(new)/(other)/scaling/costs/_components/costs-unit-context'
import { formatCostValue } from '~/app/(new)/(other)/scaling/costs/_utils/format-cost-value'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { HorizontalSeparator } from '../../horizontal-separator'
import { Square } from '../../square'
import { CostsChartTimeRangeControls } from '../controls/costs-chart-time-range-controls'
import { useChartLoading } from '../core/chart-loading-context'
import { getCommonCostsChartProps } from './common'

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
  withoutHeader?: boolean
}

export function ScalingCostsChart({
  milestones,
  tag = 'costs',
  withoutHeader,
}: Props) {
  const [scale, setScale] = useLocalStorage(`${tag}-scale`, 'lin')
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit, setUnit } = useCostsUnitContext()
  const { data: chart } = api.scaling.costs.chart.useQuery({
    range,
    filter: { type: 'all' },
  })

  const { chartRange, columns, formatYAxisLabel, valuesStyle } = useMemo(
    () =>
      getCommonCostsChartProps({
        chart,
        milestones,
        unit,
      }),
    [chart, milestones, unit],
  )

  return (
    <section className="flex flex-col gap-4">
      {!withoutHeader && <Header />}
      <ChartProvider
        columns={columns}
        valuesStyle={valuesStyle}
        formatYAxisLabel={formatYAxisLabel}
        range={chartRange}
        useLogScale={scale === 'log'}
        renderHoverContents={(data) => <ChartHover data={data} unit={unit} />}
      >
        <CostsChartTimeRangeControls
          timeRange={range}
          setTimeRange={setRange}
          range={chartRange}
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

  return (
    <div className="flex items-center justify-between gap-2">
      {loading ? (
        <>
          <Skeleton className="h-8 w-[156px]" />
          <Skeleton className="h-8 w-[98.63px]" />
        </>
      ) : (
        <>
          <RadioGroup value={unit} onValueChange={setUnit}>
            <RadioGroupItem value="usd">USD</RadioGroupItem>
            <RadioGroupItem value="eth">ETH</RadioGroupItem>
            <RadioGroupItem value="gas">GAS</RadioGroupItem>
          </RadioGroup>
          <RadioGroup value={scale} onValueChange={setScale}>
            <RadioGroupItem value="log">LOG</RadioGroupItem>
            <RadioGroupItem value="lin">LIN</RadioGroupItem>
          </RadioGroup>
        </>
      )}
    </div>
  )
}
