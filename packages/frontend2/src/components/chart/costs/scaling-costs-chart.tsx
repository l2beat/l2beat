'use client'

import { type Milestone } from '@l2beat/config'
import { useCostsTimeRangeContext } from '~/app/(side-nav)/(other)/scaling/costs/_components/costs-time-range-context'
import { useCostsUnitContext } from '~/app/(side-nav)/(other)/scaling/costs/_components/costs-unit-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { api } from '~/trpc/react'
import { useChartLoading } from '../core/chart-loading-context'
import { type ChartScale } from '../types'
import { CostsChartHover } from './costs-chart-hover'
import { CostsChartTimeRangeControls } from './costs-chart-time-range-controls'
import { useCostChartRenderParams } from './use-cost-chart-render-params'

interface Props {
  milestones: Milestone[]
  tag?: string
}

export function ScalingCostsChart({ milestones, tag = 'costs' }: Props) {
  const [scale, setScale] = useLocalStorage<ChartScale>(`${tag}-scale`, 'lin')
  const { range, setRange } = useCostsTimeRangeContext()
  const { unit, setUnit } = useCostsUnitContext()
  const { data, isLoading } = api.costs.chart.useQuery({
    range,
    filter: { type: 'all' },
  })

  const { chartRange, columns, formatYAxisLabel, valuesStyle } =
    useCostChartRenderParams({
      data,
      milestones,
      unit,
    })

  return (
    <section className="flex flex-col gap-4">
      <Header />
      <ChartProvider
        columns={columns}
        valuesStyle={valuesStyle}
        formatYAxisLabel={formatYAxisLabel}
        range={chartRange}
        useLogScale={scale === 'log'}
        isLoading={isLoading}
        renderHoverContents={(data) => (
          <CostsChartHover data={data} unit={unit} />
        )}
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
  scale: ChartScale
  setUnit: (value: CostsUnit) => void
  setScale: (value: ChartScale) => void
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
