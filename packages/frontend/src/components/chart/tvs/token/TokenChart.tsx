import type { Milestone } from '@l2beat/config'
import { assert, formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
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
        series={[{ key: 'value', fill: 'url(#fill)', stroke: 'url(#stroke)' }]}
        yAxis={{
          format: (value) => formatCurrency(value, 'usd'),
          tickCount: 4,
        }}
        syncedUntil={syncedUntil}
        defs={
          <>
            <PinkFillGradientDef id="fill" />
            <PinkStrokeGradientDef id="stroke" />
          </>
        }
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
  const { meta } = useChart()
  const payload = getTooltipEntries(row, keys)

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-48 flex-col gap-1">
        <div className="mb-1 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(row.timestamp, { mode: 'datetime' })}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null
                    ? formatCurrency(entry.value, 'usd')
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
