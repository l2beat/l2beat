'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import React from 'react'
import { Chart } from '~/app/_components/chart/core/chart'
import { ChartProvider } from '~/app/_components/chart/core/chart-provider'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { type CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { api } from '~/trpc/react'
import { useChartLoading } from '../core/chart-loading-context'
import { ChartTimeRangeControls } from '../core/chart-time-range-controls'
import { CostsChartHover } from './costs-chart-hover'
import { useCostChartRenderParams } from './use-cost-chart-render-params'

interface Props {
  milestones: Milestone[]
  projectId: string
}

export function ProjectCostsChart({ milestones, projectId }: Props) {
  const [scale, setScale] = useState('lin')
  const [range, setRange] = useState<CostsTimeRange>('1d')
  const [unit, setUnit] = useState<CostsUnit>('usd')
  const { data: chart } = api.scaling.costs.chart.useQuery({
    range,
    filter: { type: 'projects', projectIds: [projectId] },
  })

  const { chartRange, columns, formatYAxisLabel, valuesStyle } =
    useCostChartRenderParams({
      chart,
      milestones,
      unit,
    })

  return (
    <div className="flex flex-col gap-4">
      <ChartProvider
        columns={columns}
        valuesStyle={valuesStyle}
        formatYAxisLabel={formatYAxisLabel}
        range={chartRange}
        useLogScale={scale === 'log'}
        renderHoverContents={(data) => (
          <CostsChartHover data={data} unit={unit} />
        )}
      >
        <ChartTimeRangeControls
          value={range}
          setValue={setRange}
          options={[
            {
              value: '1d',
              label: '1D',
            },
            {
              value: '7d',
              label: '7D',
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
    </div>
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
