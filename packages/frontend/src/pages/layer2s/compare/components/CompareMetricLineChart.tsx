import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import { useCompareSeries } from './CompareSeriesContext'

/**
 * A single compare chart point: a timestamp plus one value per project id.
 * The shape every compare metric chart feeds into the chart.
 */
export interface CompareChartPoint {
  timestamp: number
  [projectId: string]: number | null
}

/**
 * Maps the rows of a `detailedChartWithProjectsRanges` response (a timestamp
 * followed by per-project values) to chart points, one value per selected
 * project. `getValue` returns `null` where the project has no data.
 */
export function toCompareChartPoints<
  Row extends [timestamp: number, ...unknown[]],
>(
  rows: Row[],
  projects: CompareProjectEntry[],
  getValue: (row: Row, projectId: string) => number | null,
): CompareChartPoint[] {
  return rows.map((row) => {
    const point: CompareChartPoint = { timestamp: row[0] }
    for (const project of projects) {
      point[project.id] = getValue(row, project.id)
    }
    return point
  })
}

interface Props {
  projects: CompareProjectEntry[]
  data: CompareChartPoint[] | undefined
  isLoading: boolean
  syncedUntil: number | undefined
  formatYAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
  renderTooltipTimestamp: (label: number) => ReactNode
}

/**
 * The shared compare chart renderer: lines, axes and tooltip for any
 * registry metric, so metrics only supply data and value formatting.
 */
export function CompareMetricLineChart({
  projects,
  data,
  isLoading,
  syncedUntil,
  formatYAxisLabel,
  formatTooltipValue,
  renderTooltipTimestamp,
}: Props) {
  const { colors, hoveredProjectId } = useCompareSeries()
  const chartMeta = useMemo<ChartMeta>(() => {
    return projects.reduce<ChartMeta>((acc, project) => {
      acc[project.id] = {
        label: (
          <span className="inline-flex items-center gap-1">
            <img
              src={project.iconUrl}
              alt=""
              width={14}
              height={14}
              className="size-3.5 rounded-full"
            />
            {project.name}
          </span>
        ),
        color: colors[project.id] ?? 'var(--secondary)',
        indicatorType: { shape: 'line' },
      }
      return acc
    }, {})
  }, [projects, colors])

  const timeRange = useMemo(() => getChartTimeRangeFromData(data), [data])

  return (
    <div className="flex flex-col">
      <div className="mt-3 mb-2">
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <ChartContainer
        data={data}
        meta={chartMeta}
        isLoading={isLoading}
        noDataSourceMessage="Please select at least one project"
      >
        {/* syncId matches by timestamp, so charts whose data starts at
            different times still line up under a synced hover. */}
        <TimeSeriesChart
          data={data}
          ariaLabel="Compare projects"
          syncId="compare"
          series={projects.map((project) => ({
            key: project.id,
            stroke: chartMeta[project.id]?.color,
          }))}
          highlight={hoveredProjectId}
          yAxis={{
            tickCount: 4,
            format: formatYAxisLabel,
          }}
          syncedUntil={syncedUntil}
          renderTooltip={(row, keys) => (
            <CustomTooltip
              row={row}
              keys={keys}
              formatValue={formatTooltipValue}
              renderTimestamp={renderTooltipTimestamp}
            />
          )}
        />
      </ChartContainer>
    </div>
  )
}

const MAX_TOOLTIP_ROWS = 10

function CustomTooltip({
  row,
  keys,
  formatValue,
  renderTimestamp,
}: {
  row: CompareChartPoint
  keys: string[]
  formatValue: (value: number) => string
  renderTimestamp: (label: number) => ReactNode
}) {
  const label = row.timestamp
  const visible = getTooltipEntries(row, keys, { skipNull: true })
  if (visible.length === 0) return null

  const sorted = [...visible].sort((a, b) => b.value - a.value)
  const shown = sorted.slice(0, MAX_TOOLTIP_ROWS)
  const hiddenCount = sorted.length - shown.length

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {renderTimestamp(label)}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {shown.map((entry) => {
            return (
              <ChartTooltipRow
                key={entry.name}
                name={entry.name}
                gap="gap-x-3"
                wrapLabel={false}
              >
                <ChartTooltipValue
                  value={entry.value}
                  format={formatValue}
                  className="text-primary tabular-nums"
                />
              </ChartTooltipRow>
            )
          })}
          {hiddenCount > 0 && (
            <div className="font-medium text-label-value-14 text-secondary">
              +{hiddenCount} more
            </div>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
