import type { Milestone } from '@l2beat/config'
import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import type { ChartScale } from '~/components/chart/types'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { fillGradient } from '~/components/core/chart/gradients'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { PrivacyFlowsChartPoint } from '~/server/features/privacy/getPrivacyFlowsChart'
import { formatRange } from '~/utils/dates'

interface Props {
  data: PrivacyFlowsChartPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  metric: 'count' | 'value'
  scale?: ChartScale
  project?: ChartProject
  milestones?: Milestone[]
}

const chartMeta = {
  deposits: {
    label: 'Deposits',
    color: 'var(--chart-emerald)',
    indicatorType: { shape: 'line' },
  },
  withdrawals: {
    label: 'Withdrawals',
    color: 'var(--chart-pink)',
    indicatorType: { shape: 'line' },
  },
} satisfies ChartMeta

type SeriesKey = keyof typeof chartMeta

export function PrivacyFlowChart({
  data,
  syncedUntil,
  isLoading,
  metric,
  scale = 'linear',
  project,
  milestones,
}: Props) {
  const chartData = useMemo(
    () =>
      data?.map(
        ([
          timestamp,
          depositsCount,
          withdrawalsCount,
          depositsValueUsd,
          withdrawalsValueUsd,
        ]) => ({
          timestamp,
          deposits: metric === 'count' ? depositsCount : depositsValueUsd,
          withdrawals:
            metric === 'count' ? withdrawalsCount : withdrawalsValueUsd,
        }),
      ),
    [data, metric],
  )

  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      project={project}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      legend
    >
      <TimeSeriesChart
        data={chartData}
        ariaLabel={metric === 'count' ? 'Flows count' : 'Flows value'}
        margin={{ right: project ? 0 : 1 }}
        series={[
          {
            key: 'deposits',
            stroke: 'var(--chart-emerald)',
            fill: fillGradient('var(--chart-emerald)'),
          },
          {
            key: 'withdrawals',
            stroke: 'var(--chart-pink)',
            fill: fillGradient('var(--chart-pink)'),
          },
        ]}
        yAxis={{
          scale: scale === 'linear' ? undefined : scaleSymlog,
          domain: 'autoIfSingle',
          tickCount: 4,
          format: (value) =>
            metric === 'count'
              ? formatInteger(value)
              : formatCurrency(value, 'usd'),
        }}
        syncedUntil={syncedUntil}
        renderTooltip={(row, keys) => (
          <PrivacyFlowChartTooltip row={row} keys={keys} metric={metric} />
        )}
      />
    </ChartContainer>
  )
}

function PrivacyFlowChartTooltip({
  row,
  keys,
  metric,
}: {
  row: { timestamp: number } & Record<SeriesKey, number | null>
  keys: SeriesKey[]
  metric: 'count' | 'value'
}) {
  const label = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + 1 * 24 * 60 * 60)}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {getTooltipEntries(row, keys).map((entry) => {
          return (
            <ChartTooltipRow
              key={entry.name}
              name={entry.name}
              gap="gap-x-6"
              wrapLabel={false}
            >
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {metric === 'count'
                  ? formatInteger(entry.value ?? 0)
                  : formatCurrency(entry.value ?? 0, 'usd')}
              </span>
            </ChartTooltipRow>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
