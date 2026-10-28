import type { Milestone } from '@l2beat/config'
import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import type { ChartScale } from '~/components/chart/types'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import {
  type ChartMeta,
  type ChartProject,
  useChart,
} from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
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
        margin={{ top: 20, right: project ? 0 : 1 }}
        series={[
          {
            key: 'deposits',
            stroke: 'var(--chart-emerald)',
            fill: `url(#privacy-${metric}-deposits-fill)`,
            hidden: !dataKeys.includes('deposits'),
          },
          {
            key: 'withdrawals',
            stroke: 'var(--chart-pink)',
            fill: `url(#privacy-${metric}-withdrawals-fill)`,
            hidden: !dataKeys.includes('withdrawals'),
          },
        ]}
        yAxis={{
          scale: scale === 'linear' ? undefined : scaleSymlog,
          domain: dataKeys.length === 1 ? 'auto' : undefined,
          tickCount: 4,
          format: (value) =>
            metric === 'count'
              ? formatInteger(value)
              : formatCurrency(value, 'usd'),
        }}
        syncedUntil={syncedUntil}
        defs={
          <>
            <CustomFillGradientDef
              id={`privacy-${metric}-deposits-fill`}
              colors={{
                primary: 'var(--chart-emerald)',
                secondary: 'var(--chart-emerald)',
              }}
            />
            <CustomFillGradientDef
              id={`privacy-${metric}-withdrawals-fill`}
              colors={{
                primary: 'var(--chart-pink)',
                secondary: 'var(--chart-pink)',
              }}
            />
          </>
        }
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
  const { meta } = useChart()
  const label = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + 1 * 24 * 60 * 60)}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {getTooltipEntries(row, keys).map((entry) => {
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
                {metric === 'count'
                  ? formatInteger(Number(entry.value ?? 0))
                  : formatCurrency(Number(entry.value ?? 0), 'usd')}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
