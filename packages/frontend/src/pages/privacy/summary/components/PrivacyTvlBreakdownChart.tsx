import { useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export interface PrivacyTvlBreakdownProject {
  id: string
  name: string
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
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      <AreaChart responsive data={chartData} margin={{ top: 20, right: 1 }}>
        <ChartLegendToggleAll
          showAllSelected={showAllSelected}
          onToggleAll={toggleAllDataKeys}
        />
        {projects.map((project) => (
          <Area
            key={project.id}
            dataKey={project.id}
            stackId="a"
            hide={!dataKeys.includes(project.id)}
            fill={chartMeta[project.id]?.color}
            fillOpacity={1}
            stroke={chartMeta[project.id]?.color}
            strokeWidth={0}
            activeDot={false}
            isAnimationActive={false}
          />
        ))}
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            tickCount: 4,
            tickFormatter: (value) => formatCurrency(Number(value), 'usd'),
          }}
          syncedUntil={syncedUntil}
        />
        <ChartTooltip filterNull={false} content={<CustomTooltip />} />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({ payload, label }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  const visible = payload.filter((p) => p.type !== 'none' && !p.hide)
  const total = visible.reduce<number | null>((acc, curr) => {
    if (curr.value === null || curr.value === undefined) return acc
    return (acc ?? 0) + curr.value
  }, null)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, {
            longMonthName: true,
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
              const config = entry.name ? meta[entry.name] : undefined
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
