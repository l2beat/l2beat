import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import {
  type ChartMeta,
  type ChartProject,
  useChart,
} from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatTimestamp } from '~/utils/dates'

interface TvsValueChartDataPoint {
  timestamp: number
  value: number | null
}

interface Props {
  data: TvsValueChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  project?: ChartProject
  milestones?: Milestone[]
}

const chartMeta = {
  value: {
    label: 'TVL',
    color: 'var(--chart-pink)',
    indicatorType: { shape: 'line' },
  },
} satisfies ChartMeta

export function TvsValueChart({
  data,
  syncedUntil,
  isLoading,
  project,
  milestones,
}: Props) {
  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      project={project}
      milestones={milestones}
      legend
    >
      <TimeSeriesChart
        data={data}
        ariaLabel="Value secured"
        series={[
          {
            key: 'value',
            fill: 'url(#tvs-value-fill)',
            stroke: 'url(#tvs-value-stroke)',
          },
        ]}
        yAxis={{
          tickCount: 4,
          format: (value) => formatCurrency(value, 'usd'),
        }}
        syncedUntil={syncedUntil}
        defs={
          <>
            <PinkFillGradientDef id="tvs-value-fill" />
            <PinkStrokeGradientDef id="tvs-value-stroke" />
          </>
        }
        renderTooltip={(row, keys) => (
          <TvsValueChartTooltip row={row} keys={keys} />
        )}
      />
    </ChartContainer>
  )
}

function TvsValueChartTooltip({
  row,
  keys,
}: {
  row: TvsValueChartDataPoint
  keys: 'value'[]
}) {
  const { meta } = useChart()
  const payload = getTooltipEntries(row, keys)

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(row.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry) => {
          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={config.indicatorType}
                  backgroundColor={config.color}
                />
                <span className="font-medium text-label-value-14">
                  {config.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.value === null
                  ? 'No data'
                  : formatCurrency(entry.value, 'usd')}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
