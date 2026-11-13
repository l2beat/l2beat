import type { Milestone } from '@l2beat/config'
import {
  formatActivityCount,
  formatInteger,
  UnixTime,
} from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import { L2_CATEGORY_COLORS } from '~/components/chart/l2CategoryColors'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { trimZeroDecimals } from '~/components/core/chart/utils/yAxisTicks'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { formatRange } from '~/utils/dates'
import type { ChartScale } from '../types'

export const RECATEGORISED_ACTIVITY_CHART_META = {
  rollups: {
    label: 'Rollups',
    color: L2_CATEGORY_COLORS.rollups,
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: L2_CATEGORY_COLORS.validiumsAndOptimiums,
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: L2_CATEGORY_COLORS.others,
    indicatorType: {
      shape: 'line',
    },
  },
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

type SeriesKey = keyof typeof RECATEGORISED_ACTIVITY_CHART_META

interface Props {
  data: RecategorisedActivityChartData | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  milestones: Milestone[]
  chartMeta: ChartMeta
  interactiveLegend: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
  }
  scale?: ChartScale
  /**
   * The summary page's compact chart: unit-less ticks, as its header names
   * the unit, with a halo behind them.
   */
  compact?: boolean
  /**
   * Days each row sums, ending with its own, where the rows are totals over
   * a trailing window rather than single days.
   */
  bucketDays?: number
}

export function L2RecategorizedActivityChart({
  data,
  isLoading,
  isPlaceholderData,
  milestones,
  scale,
  compact,
  bucketDays = 1,
  chartMeta,
  interactiveLegend: { dataKeys, onItemClick },
}: Props) {
  const { metric } = useActivityMetricContext()

  const rowSeconds = UnixTime.periodToSeconds(data?.resolution ?? 'day')
  const resolutionSeconds = rowSeconds * bucketDays
  const chartData = useMemo(() => {
    const getDataPoint = (uops: number | null, tx: number | null) => {
      const count = metric === 'uops' ? uops : tx
      return count !== null ? count / resolutionSeconds : null
    }

    return data?.data.map(
      ([
        timestamp,
        rollupsUops,
        validiumsAndOptimiumsUops,
        othersUops,
        ethereumUops,
        rollupsTx,
        validiumsAndOptimiumsTx,
        othersTx,
        ethereumTx,
      ]) => {
        return {
          timestamp,
          rollups: getDataPoint(rollupsUops, rollupsTx),
          validiumsAndOptimiums: getDataPoint(
            validiumsAndOptimiumsUops,
            validiumsAndOptimiumsTx,
          ),
          others: getDataPoint(othersUops, othersTx),
          ethereum: getDataPoint(ethereumUops, ethereumTx),
        }
      },
    )
  }, [data, metric, resolutionSeconds])

  return (
    <ChartContainer
      isPlaceholderData={isPlaceholderData}
      meta={chartMeta}
      data={chartData}
      isLoading={isLoading}
      legend
      interactiveLegend={{
        dataKeys,
        onItemClick,
        disableOnboarding: true,
      }}
      milestones={milestones}
    >
      <TimeSeriesChart
        data={chartData}
        ariaLabel="Activity"
        series={(
          ['rollups', 'validiumsAndOptimiums', 'others', 'ethereum'] as const
        ).map((key) => ({
          key,
          ...tinted(RECATEGORISED_ACTIVITY_CHART_META[key].color),
        }))}
        yAxis={{
          scale: scale === 'symlog' ? scaleSymlog : undefined,
          domain: 'autoIfSingle',
          ...(compact
            ? {
                format: (value: number) =>
                  trimZeroDecimals(formatActivityCount(value)),
              }
            : { unit: metric === 'uops' ? ' UOPS' : ' TPS' }),
        }}
        yLabelHalo={compact}
        syncedUntil={data?.syncedUntil}
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            visibleKeys={keys}
            syncedUntil={data?.syncedUntil}
            resolutionSeconds={resolutionSeconds}
            rowSeconds={rowSeconds}
            metric={metric}
          />
        )}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  visibleKeys,
  syncedUntil,
  resolutionSeconds,
  rowSeconds,
  metric,
}: {
  row: { timestamp: number } & Record<SeriesKey, number | null>
  visibleKeys: SeriesKey[]
  syncedUntil: number | undefined
  resolutionSeconds: number
  rowSeconds: number
  metric: ActivityMetric
}) {
  const label = row.timestamp
  // Series without a value at this point are left out.
  const payload = getTooltipEntries(row, visibleKeys, { skipNull: true })
  if (payload.length === 0) return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {/* The window the row sums, ending with the row's own period. */}
          {formatRange(
            label + rowSeconds - resolutionSeconds,
            label + rowSeconds,
          )}
        </div>
        <span className="text-heading-16">Average {metric.toUpperCase()}</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={entry.value}
                format={formatActivityCount}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>

        <span className="mt-3 text-heading-16">
          {metric === 'uops' ? 'Operations' : 'Transactions'} count
        </span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={syncedUntil && syncedUntil < label ? null : entry.value}
                format={(value) => formatInteger(value * resolutionSeconds)}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
