import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import compact from 'lodash/compact'
import { useMemo } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
  sumEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import type { TvsChangeEventsData } from '~/server/features/layer2s/tvs/getTvsChangeEvents'
import { useTRPC } from '~/trpc/React'
import { formatSnapshotTimestamp } from '~/utils/dates'
import {
  type ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import {
  CHANGE_PINS_TOP_MARGIN,
  ChangePins,
  ChangeTooltipLine,
  getChangeEventsAt,
  useChangeEvents,
  usePlotHeightScale,
} from '../change-pins/ChangePins'
import { TVS_CHANGE_FORMAT } from '../change-pins/formats'
import type { ChangeEvent } from '../change-pins/selectChangeEvents'
import type { ChartUnit } from '../types'

/** The L2 categories, which change pins on any TVS chart are coloured by. */
export const l2CategoryTvsChartMeta = {
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
} satisfies ChartMeta
const chartMeta = l2CategoryTvsChartMeta

export function L2SummaryTvsChart({
  unit,
  range,
  rangeLabel,
}: {
  unit: ChartUnit
  range: ChartRange
  /** Written after the change, e.g. "1y". */
  rangeLabel: string
}) {
  const trpc = useTRPC()
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  const { data, isLoading } = useQuery(
    trpc.tvs.recategorisedChart.queryOptions({
      range,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
      filter: { type: 'layer2' },
    }),
  )

  // Changes are found in whole days and in dollars.
  const hasChangePins = unit === 'usd' && rangeToResolution(range) === 'day'
  const { data: changeData } = useQuery({
    ...trpc.tvs.changeEvents.queryOptions({
      range,
      filter: { type: 'layer2' },
      excludeRwaRestrictedTokens: true,
    }),
    enabled: hasChangePins,
  })
  const { toPlotHeight, onYScale } = usePlotHeightScale()
  const changeEvents = useChangeEvents(changeData, {
    metric: 'usd',
    dataKeys,
    format: TVS_CHANGE_FORMAT,
    toPlotHeight,
  })

  const chartData = useMemo(() => toChartData(data), [data])
  const stats = getStats(chartData, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <ChartCardHeader
        title="Value secured"
        link={{ href: '/layer2s/tvs', label: 'Breakdown' }}
        value={
          stats?.total !== undefined
            ? formatCurrency(stats.total, unit)
            : undefined
        }
        change={stats?.change}
        rangeLabel={rangeLabel}
        isLoading={stats?.total === undefined}
      />
      <ChartContainer
        isPlaceholderData={false}
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        legend
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
          disableOnboarding: true,
        }}
      >
        <TimeSeriesChart
          data={chartData}
          ariaLabel="Value secured"
          margin={hasChangePins ? { top: CHANGE_PINS_TOP_MARGIN } : undefined}
          series={[
            {
              key: 'rollups',
              ...tinted(chartMeta.rollups.color),
            },
            {
              key: 'validiumsAndOptimiums',
              ...tinted(chartMeta.validiumsAndOptimiums.color),
            },
            {
              key: 'others',
              ...tinted(chartMeta.others.color),
            },
          ]}
          yAxis={{
            domain: 'autoIfSingle',
            format: (value: number) => formatCurrency(value, unit),
          }}
          syncedUntil={data?.syncedUntil}
          onYScale={onYScale}
          renderTooltip={(row, keys) => (
            <CustomTooltip
              row={row}
              visibleKeys={keys}
              resolution={rangeToResolution(range)}
              changes={
                changeData && {
                  events: getChangeEventsAt(changeEvents, row.timestamp),
                  projects: changeData.projects,
                }
              }
            />
          )}
        />
        {hasChangePins && changeData && (
          <ChangePins
            events={changeEvents}
            projects={changeData.projects}
            chartData={chartData}
            chartMeta={chartMeta}
            format={TVS_CHANGE_FORMAT}
          />
        )}
      </ChartContainer>
    </div>
  )
}

type ChartRow = NonNullable<ReturnType<typeof toChartData>>[number]

function CustomTooltip({
  row,
  visibleKeys,
  resolution,
  changes,
}: {
  row: ChartRow
  visibleKeys: (keyof typeof chartMeta)[]
  resolution: ChartResolution
  changes?: {
    events: ChangeEvent[]
    projects: TvsChangeEventsData['projects']
  }
}) {
  const label = row.timestamp
  const payload = getTooltipEntries(row, visibleKeys)
  const total = sumEntries(payload)
  return (
    <ChartTooltipWrapper>
      <div className="flex w-[180px]! flex-col [@media(min-width:600px)]:w-60!">
        <ChartTooltipTitle>
          {formatSnapshotTimestamp(label, resolution)}
        </ChartTooltipTitle>
        {payload.length > 1 && (
          <TooltipHeader
            className="mt-3"
            label={
              <>
                <span className="[@media(min-width:600px)]:hidden">Total</span>
                <span className="hidden [@media(min-width:600px)]:inline">
                  Total value secured
                </span>
              </>
            }
            value={total !== null ? formatCurrency(total, 'usd') : 'No data'}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            const event = changes?.events.find((e) => e.category === entry.name)
            return (
              <div key={entry.name} className="flex flex-col gap-2">
                <ChartTooltipRow name={entry.name} gap="gap-x-1">
                  <ChartTooltipValue
                    value={entry.value}
                    format={(value) => formatCurrency(value, 'usd')}
                  />
                </ChartTooltipRow>
                {event && changes && (
                  <ChangeTooltipLine
                    event={event}
                    projects={changes.projects}
                    format={TVS_CHANGE_FORMAT}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function toChartData(
  data:
    | { chart: [number, number | null, number | null, number | null][] }
    | undefined,
) {
  return data?.chart.map(
    ([timestamp, rollups, validiumsAndOptimiums, others]) => ({
      timestamp,
      rollups,
      validiumsAndOptimiums,
      others,
    }),
  )
}

function getStats(
  data:
    | {
        timestamp: number
        rollups: number | null
        validiumsAndOptimiums: number | null
        others: number | null
      }[]
    | undefined,
  dataKeys: (keyof typeof chartMeta)[],
) {
  if (!data) {
    return undefined
  }
  const pointsWithData = data.filter(
    (point) =>
      point.rollups !== null ||
      point.validiumsAndOptimiums !== null ||
      point.others !== null,
  )

  const oldestDataPoint = pointsWithData.at(0)
  const newestDataPoint = pointsWithData.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const toSum = compact([
    dataKeys.includes('rollups')
      ? {
          oldest: oldestDataPoint.rollups,
          newest: newestDataPoint.rollups,
        }
      : undefined,
    dataKeys.includes('validiumsAndOptimiums')
      ? {
          oldest: oldestDataPoint.validiumsAndOptimiums,
          newest: newestDataPoint.validiumsAndOptimiums,
        }
      : undefined,
    dataKeys.includes('others')
      ? {
          oldest: oldestDataPoint.others,
          newest: newestDataPoint.others,
        }
      : undefined,
  ])

  const oldestTotal = toSum.reduce((acc, curr) => acc + (curr.oldest ?? 0), 0)
  const newestTotal = toSum.reduce((acc, curr) => acc + (curr.newest ?? 0), 0)
  const change = newestTotal / oldestTotal - 1

  return {
    total: newestTotal,
    change,
  }
}
