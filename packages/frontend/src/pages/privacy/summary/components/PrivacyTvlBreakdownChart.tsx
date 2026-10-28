import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import { type ChartMeta, useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'

export interface PrivacyTvlBreakdownProject {
  id: string
  name: string
  hasTvl: boolean
}

interface Props {
  data:
    | [timestamp: number, valuesByProject: Record<string, number | null>][]
    | undefined
  projects: PrivacyTvlBreakdownProject[]
  syncedUntil: number | undefined
  isLoading: boolean
}

export function PrivacyTvlBreakdownChart({
  data,
  projects,
  syncedUntil,
  isLoading,
}: Props) {
  const chartMeta = useMemo<ChartMeta>(() => {
    const colors = generateAccessibleColors(projects.length)
    return projects.reduce<ChartMeta>((acc, project, index) => {
      acc[project.id] = {
        label: project.name,
        color: colors[index] ?? 'var(--secondary)',
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {})
  }, [projects])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const chartData = useMemo(
    () =>
      data?.map(([timestamp, valuesByProject]) => {
        const point: { timestamp: number; [key: string]: number | null } = {
          timestamp,
        }
        for (const project of projects) {
          point[project.id] = valuesByProject[project.id] ?? null
        }
        return point
      }),
    [data, projects],
  )

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
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
        series={projects.map((project) => ({
          key: project.id,
          stack: true,
          fill: chartMeta[project.id]?.color,
          activeDot: false,
          hidden: !dataKeys.includes(project.id),
        }))}
        yAxis={{
          tickCount: 4,
          format: (value) => formatCurrency(value, 'usd'),
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
  row: { timestamp: number; [key: string]: number | null }
  keys: string[]
}) {
  const { meta } = useChart()
  const label = row.timestamp
  const visible = getTooltipEntries(row, keys)
  const total = visible.reduce<number | null>((acc, curr) => {
    if (curr.value === null || curr.value === undefined) return acc
    return (acc ?? 0) + curr.value
  }, null)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, {
            mode: 'datetime',
          })}
        </div>
        {visible.length > 1 && (
          <>
            <div className="mt-3 mb-1.5 flex items-center justify-between gap-2 text-heading-16">
              <span>Total</span>
              <span className="text-primary">
                {total !== null ? formatCurrency(total, 'usd') : 'No data'}
              </span>
            </div>
            <HorizontalSeparator />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {[...visible]
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((entry) => {
              const config = meta[entry.name]
              if (!config) return null
              return (
                <div
                  key={entry.name}
                  className="flex items-center justify-between gap-x-3"
                >
                  <div className="flex items-center gap-1">
                    <ChartDataIndicator
                      backgroundColor={config.color}
                      type={config.indicatorType}
                    />
                    <span className="font-medium text-label-value-14">
                      {config.label}
                    </span>
                  </div>
                  <span className="whitespace-nowrap font-medium text-label-value-15 text-primary tabular-nums">
                    {entry.value !== null && entry.value !== undefined
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
