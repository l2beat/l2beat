'use client'

import { type Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { formatCostValue } from '~/app/(new)/(other)/scaling/costs/_utils/format-cost-value'
import { ChartTimeRangeControls } from '~/app/_components/chart/controls/chart-time-range-controls'
import { Chart } from '~/app/_components/chart/core/chart'
import { useChartContext } from '~/app/_components/chart/core/chart-context'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type CostsUnit } from '~/server/features/scaling/get-scaling-costs-entries'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/format'
import { formatNumber } from '~/utils/format-number'
import { HorizontalSeparator } from '../horizontal-separator'
import { Square } from '../square'
import { getCostsChart } from '~/server/features/costs/get-costs-chart'

interface CostsChartPointData {
  timestamp: number
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
  unit: CostsUnit
}
interface Props {
  milestones: Milestone[]
  tag?: string
}

const DENCUN_UPGRADE_TIMESTAMP = 1710288000

export function CostsChart({ milestones, tag = 'costs' }: Props) {
  const [timeRange, setTimeRange] = useLocalStorage(`${tag}-time-range`, '1y')
  const [unit, setUnit] = useLocalStorage<CostsUnit>(`${tag}-unit`, 'usd')
  const [scale, setScale] = useLocalStorage(`${tag}-scale`, 'lin')
  const costs = getCostsChart(timeRange, unit)
  const mappedMilestones = getMilestones(milestones)

  const formatYAxisLabel = (value: number) =>
    unit === 'gas'
      ? formatNumber(value)
      : formatCurrency(value, unit, { showLessThanMinimum: false })

  const rangeStart = costs.data[0]?.[0]
  const rangeEnd = costs.data[costs.data.length - 1]?.[0]
  assert(
    rangeStart !== undefined && rangeEnd !== undefined,
    'Programmer error: rangeStart and rangeEnd are undefined',
  )

  const columns = costs.data.map((dataPoint) => {
    const [timestamp, total, overhead, calldata, compute, blobs = 0] = dataPoint

    const isPostDencun = timestamp >= DENCUN_UPGRADE_TIMESTAMP
    return {
      values: [
        { value: overhead + compute + blobs + calldata },
        { value: overhead + compute + blobs },
        { value: overhead + compute },
        { value: overhead },
      ],
      data: {
        timestamp,
        total,
        calldata,
        blobs: isPostDencun && blobs > 0 ? blobs : undefined,
        compute,
        overhead,
        unit,
      },
      milestone: mappedMilestones[timestamp],
    }
  })

  return (
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
      renderHoverContents={(data) => <ChartHover data={data} />}
    >
      <section className="flex flex-col gap-4">
        <Header />
        <ChartTimeRangeControls
          value={timeRange}
          setValue={setTimeRange}
          options={[
            { value: '1d', label: '1D' },
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
            { value: '90d', label: '90D' },
            { value: '180d', label: '180D' },
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
      </section>
    </ChartProvider>
  )
}

function ChartHover({ data }: { data: CostsChartPointData }) {
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">Total</span>
        {formatCostValue(data.total, data.unit)}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="calldata" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Calldata
          </span>
        </div>
        {formatCostValue(data.calldata, data.unit)}
      </div>
      {data.blobs ? (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Square variant="blobs" />
            <span className="text-sm text-gray-700 dark:text-gray-50">
              Blobs
            </span>
          </div>
          {formatCostValue(data.blobs, data.unit)}
        </div>
      ) : null}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="compute" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Compute
          </span>
        </div>
        {formatCostValue(data.compute, data.unit)}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="overhead" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Overhead
          </span>
        </div>
        {formatCostValue(data.overhead, data.unit)}
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="mb-4">
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
  const { loading } = useChartContext()

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

function getMilestones(milestones: Milestone[]): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}
