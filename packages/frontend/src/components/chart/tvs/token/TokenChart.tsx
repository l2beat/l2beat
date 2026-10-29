import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import type { ProjectToken } from '~/server/features/layer2s/tvs/tokens/getTokensForProject'
import { formatTimestamp } from '~/utils/dates'

type TokenChartDataPoint = {
  timestamp: number
  value: number | null
}

interface Props {
  data: TokenChartDataPoint[] | undefined
  project: ChartProject
  syncedUntil: number | undefined
  isLoading: boolean
  milestones: Milestone[]
  token: ProjectToken
}

export function TokenChart({
  data,
  project,
  isLoading,
  milestones,
  token,
  syncedUntil,
}: Props) {
  const chartMeta = useMemo(
    () => ({
      value: {
        label: token.symbol,
        color: 'var(--chart-pink)',
        indicatorType: {
          shape: 'line',
        },
      },
    }),
    [token.symbol],
  ) satisfies ChartMeta

  return (
    <ChartContainer
      meta={chartMeta}
      data={data}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
      legend
    >
      <TimeSeriesChart
        data={data}
        ariaLabel="Token value"
        series={[
          {
            key: 'value',
            fill: CHART_GRADIENTS.pink.fill,
            stroke: CHART_GRADIENTS.pink.stroke,
          },
        ]}
        yAxis={{
          format: (value) => formatCurrency(value, 'usd'),
          tickCount: 4,
        }}
        syncedUntil={syncedUntil}
        renderTooltip={(row, keys) => <CustomTooltip row={row} keys={keys} />}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  keys,
}: {
  row: TokenChartDataPoint
  keys: 'value'[]
}) {
  const payload = getTooltipEntries(row, keys)

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-48 flex-col gap-1">
        <div className="mb-1 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(row.timestamp, { mode: 'datetime' })}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name} gap="gap-x-1">
              <ChartTooltipValue
                value={entry.value}
                format={(value) => formatCurrency(value, 'usd')}
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
