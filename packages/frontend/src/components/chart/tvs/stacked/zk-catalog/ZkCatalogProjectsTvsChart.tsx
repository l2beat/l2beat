import type { Milestone } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartUnit } from '~/components/chart/types'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
  sumEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { useL2RwaRestrictedTokensContext } from '~/pages/layer2s/components/L2RwaRestrictedTokensContext'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'

interface ZkCatalogProjectsTvsChartProps {
  project: ChartProject
  milestones: Milestone[]
  projectsForTvs: {
    projectId: ProjectId
    name: string
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}

export function ZkCatalogProjectsTvsChart({
  project,
  milestones,
  projectsForTvs,
}: ZkCatalogProjectsTvsChartProps) {
  const trpc = useTRPC()
  const { range, unit } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useL2RwaRestrictedTokensContext()

  const { data, isLoading } = useQuery(
    trpc.tvs.detailedChartWithProjectsRanges.queryOptions({
      projects: projectsForTvs,
      range,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens,
    }),
  )

  const projectLabels = useMemo(() => {
    return projectsForTvs.reduce(
      (acc, project) => {
        acc[project.projectId] = project.name
        return acc
      },
      {} as Record<string, string>,
    )
  }, [projectsForTvs])

  // `sinceTimestamp` comes from the server already floored to the active
  // resolution, matching the chart's data gate. Building the tooltip gate from
  // it (rather than re-rounding here) keeps the two from drifting apart.
  const sinceByProjectId = useMemo(
    () =>
      new Map(
        (data?.projects ?? []).map((p) => [
          p.projectId.toString(),
          p.sinceTimestamp,
        ]),
      ),
    [data?.projects],
  )

  const colors = useMemo(
    () => generateAccessibleColors(data?.projects.length ?? 0),
    [data?.projects.length],
  )

  const chartData = useMemo(() => {
    if (!data) return undefined

    return data.chart.map(([timestamp, ethPrice, projects]) => {
      const divider = unit === 'usd' ? 1 : ethPrice
      const dataPoint: {
        timestamp: number
        [key: string]: number | null
      } = { timestamp }

      for (const { projectId } of data.projects) {
        const value = projects[projectId] ?? null
        if (value === null) {
          dataPoint[projectId] = null
          continue
        }
        if (divider === null || divider === 0) {
          dataPoint[projectId] = null
          continue
        }
        dataPoint[projectId] = value[0] / divider
      }

      return dataPoint
    })
  }, [data, unit])

  // Chart: oldest sinceTimestamp at the bottom, newest at the top
  const chartOrderedIds = useMemo(() => {
    if (!data) return []
    return [...data.projects]
      .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
      .map((p) => p.projectId)
  }, [data])

  // Legend: biggest current value first
  const legendOrderedIds = useMemo(() => {
    if (!data) return []
    const lastPoint = chartData?.[chartData.length - 1]
    return data.projects
      .map((p) => p.projectId)
      .sort((a, b) => (lastPoint?.[b] ?? 0) - (lastPoint?.[a] ?? 0))
  }, [data, chartData])

  const chartMeta = useMemo(() => {
    let colorIndex = 0
    return legendOrderedIds.reduce((acc, projectId) => {
      const key = projectId.toString()
      const color = colors[colorIndex++] ?? '#999999'

      acc[key] = {
        label: projectLabels[key] ?? key,
        color: color ?? '#999999',
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {} as ChartMeta)
  }, [legendOrderedIds, projectLabels, colors])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      project={project}
      legend
      legendLeading={
        <ChartLegendToggleAll
          showAllSelected={showAllSelected}
          onToggleAll={toggleAllDataKeys}
        />
      }
    >
      <TimeSeriesChart
        data={chartData}
        ariaLabel="Value secured by project"
        series={chartOrderedIds.map((projectId) => ({
          key: projectId,
          fill: chartMeta[projectId]?.color,
          stack: true,
          // Every layer of the stack marks the hovered row.
          activeDot: true,
        }))}
        yAxis={{
          domain: 'autoIfSingle',
          format: (value) => formatCurrency(value, unit),
          tickCount: 4,
        }}
        syncedUntil={data?.syncedUntil}
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            keys={keys}
            unit={unit}
            sinceByProjectId={sinceByProjectId}
          />
        )}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  keys,
  unit,
  sinceByProjectId,
}: {
  row: { timestamp: number }
  keys: string[]
  unit: ChartUnit
  sinceByProjectId: Map<string, number>
}) {
  const label = row.timestamp

  const actualPayload = getTooltipEntries(row, keys)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .filter((entry) => {
      const since = sinceByProjectId.get(entry.name)
      return since !== undefined && label >= since
    })

  const total = sumEntries(actualPayload) ?? 0

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(label, { mode: 'datetime' })}
      </div>
      <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
        <span>Total</span>
        <span className="whitespace-nowrap text-primary tabular-nums">
          {formatCurrency(total, unit)}
        </span>
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {actualPayload.slice(0, 20).map((entry, index) => {
          return (
            <ChartTooltipRow
              key={index}
              name={entry.name}
              gap="gap-x-1"
              wrapLabel={false}
            >
              <div className="flex items-end justify-end gap-1 max-sm:flex-col sm:items-center">
                <ChartTooltipValue
                  value={entry.value}
                  format={(value) => formatCurrency(value, unit)}
                />
                {entry.value !== null && total > 0 && (
                  <span className="font-medium text-label-value-13 text-secondary sm:text-label-value-15">
                    ({formatPercent(entry.value / total)})
                  </span>
                )}
              </div>
            </ChartTooltipRow>
          )
        })}
        {actualPayload.length > 20 && (
          <div className="font-medium text-label-value-14 text-secondary">
            + {actualPayload.length - 20} more
          </div>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}
