import type { Milestone } from '@l2beat/config'
import {
  formatActivityCount,
  formatInteger,
  UnixTime,
} from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ActivityChangeEventsData } from '~/server/features/layer2s/activity/getActivityChangeEvents'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { formatRange } from '~/utils/dates'
import {
  CHANGE_PINS_TOP_MARGIN,
  ChangePins,
  ChangeTooltipLine,
  getChangeEventsAt,
  useChangeEvents,
  usePlotHeightScale,
} from '../change-pins/ChangePins'
import { ACTIVITY_CHANGE_FORMAT } from '../change-pins/formats'
import type { ChangeEvent } from '../change-pins/selectChangeEvents'
import type { ChartScale } from '../types'

export const RECATEGORISED_ACTIVITY_CHART_META = {
  rollups: {
    label: 'Rollups',
    color: 'var(--chart-pink)',
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'var(--chart-cyan)',
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: 'var(--chart-yellow)',
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
  /** Reserves the pins' row, so the plot doesn't move when they load. */
  hasChangePins?: boolean
  changeEvents?: ActivityChangeEventsData
}

export function L2RecategorizedActivityChart({
  data,
  isLoading,
  isPlaceholderData,
  milestones,
  scale,
  chartMeta,
  interactiveLegend: { dataKeys, onItemClick },
  hasChangePins,
  changeEvents,
}: Props) {
  const { metric } = useActivityMetricContext()
  const { toPlotHeight, onYScale } = usePlotHeightScale()
  const events = useChangeEvents(changeEvents, {
    metric,
    dataKeys,
    format: ACTIVITY_CHANGE_FORMAT,
    toPlotHeight,
  })

  const resolutionSeconds = UnixTime.periodToSeconds(data?.resolution ?? 'day')
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
        margin={hasChangePins ? { top: CHANGE_PINS_TOP_MARGIN } : undefined}
        series={(
          ['rollups', 'validiumsAndOptimiums', 'others', 'ethereum'] as const
        ).map((key) => ({
          key,
          ...tinted(RECATEGORISED_ACTIVITY_CHART_META[key].color),
        }))}
        yAxis={{
          scale: scale === 'symlog' ? scaleSymlog : undefined,
          domain: 'autoIfSingle',
          unit: metric === 'uops' ? ' UOPS' : ' TPS',
          // Abbreviated like the figure above it ("30.00K"), as tvs and
          // costs axes are
          format: (value) => formatActivityCount(value),
        }}
        syncedUntil={data?.syncedUntil}
        onYScale={onYScale}
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            visibleKeys={keys}
            syncedUntil={data?.syncedUntil}
            resolutionSeconds={resolutionSeconds}
            metric={metric}
            changes={
              changeEvents && {
                events: getChangeEventsAt(events, row.timestamp),
                projects: changeEvents.projects,
              }
            }
          />
        )}
      />
      {hasChangePins && changeEvents && (
        <ChangePins
          events={events}
          projects={changeEvents.projects}
          chartData={chartData}
          chartMeta={chartMeta}
          format={ACTIVITY_CHANGE_FORMAT}
        />
      )}
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  visibleKeys,
  syncedUntil,
  resolutionSeconds,
  metric,
  changes,
}: {
  row: { timestamp: number } & Record<SeriesKey, number | null>
  visibleKeys: SeriesKey[]
  syncedUntil: number | undefined
  resolutionSeconds: number
  metric: ActivityMetric
  changes?: {
    events: ChangeEvent[]
    projects: ActivityChangeEventsData['projects']
  }
}) {
  const label = row.timestamp
  // Series without a value at this point are left out.
  const payload = getTooltipEntries(row, visibleKeys, { skipNull: true })
  if (payload.length === 0) return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <ChartTooltipTitle className="mb-3 whitespace-nowrap">
          {formatRange(label, label + resolutionSeconds)}
        </ChartTooltipTitle>
        <TooltipHeader label={`Average ${metric.toUpperCase()}`} />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            const event = changes?.events.find((e) => e.category === entry.name)
            return (
              <div key={entry.name} className="flex flex-col gap-2">
                <ChartTooltipRow name={entry.name}>
                  <ChartTooltipValue
                    value={entry.value}
                    format={formatActivityCount}
                    className="tabular-nums"
                  />
                </ChartTooltipRow>
                {event && changes && (
                  <ChangeTooltipLine
                    event={event}
                    projects={changes.projects}
                    format={ACTIVITY_CHANGE_FORMAT}
                  />
                )}
              </div>
            )
          })}
        </div>

        <TooltipHeader
          className="mt-3"
          label={`${metric === 'uops' ? 'Operations' : 'Transactions'} count`}
        />
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
