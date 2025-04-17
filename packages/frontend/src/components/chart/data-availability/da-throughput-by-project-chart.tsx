'use client'
import { sum } from 'lodash'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Bar, BarChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { DaThroughputChartDataByChart } from '~/server/features/data-availability/throughput/get-da-throughput-chart-by-project'
import type { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generate-colors'
import { getDaDataParams } from './get-da-data-params'

interface Props {
  data: DaThroughputChartDataByChart | undefined
  isLoading: boolean
  range: DaThroughputTimeRange
  projectsToShow: string[]
  customColors: Record<string, string>
}

export function DaThroughputByProjectChart({
  data,
  isLoading,
  range,
  projectsToShow,
  customColors,
}: Props) {
  const colors = useMemo(
    () => generateAccessibleColors(projectsToShow.length),
    [projectsToShow],
  )

  const max = useMemo(() => {
    return data
      ? Math.max(
          ...data.map(([_, values]) =>
            sum(
              Object.entries(values).map(([project, value]) => {
                if (!projectsToShow.includes(project)) return 0
                return value
              }),
            ),
          ),
        )
      : undefined
  }, [data, projectsToShow])

  const { denominator, unit } = getDaDataParams(max)

  const chartMeta = useMemo(() => {
    let colorIndex = 0
    return projectsToShow?.reduce((acc, project) => {
      if (!acc[project]) {
        acc[project] = {
          label: project,
          color:
            project === 'Others'
              ? 'hsl(var(--secondary))'
              : (customColors[project] ?? colors[colorIndex++]!),
          indicatorType: { shape: 'square' },
        }
      }

      return acc
    }, {} as ChartMeta)
  }, [colors, customColors, projectsToShow])

  const chartData = useMemo(() => {
    if (projectsToShow.length === 0) {
      return []
    }

    return (
      data?.map(([timestamp, values]) => {
        return {
          timestamp: timestamp,
          ...Object.fromEntries(
            Object.entries(values)
              .map(([key, value]) => {
                if (!projectsToShow.includes(key)) return
                return [key, value / denominator] as const
              })
              .filter((v) => v !== undefined),
          ),
        }
      }) ?? []
    )
  }, [data, projectsToShow, denominator])

  return (
    <ChartContainer data={chartData} meta={chartMeta} isLoading={isLoading}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20 }}
        barCategoryGap={range === '30d' ? 4 : 0}
      >
        <ChartLegend content={<ChartLegendContent />} />
        {projectsToShow?.map((project) => (
          <Bar
            key={project}
            dataKey={project}
            stackId="a"
            fill={chartMeta?.[project]?.color}
            isAnimationActive={false}
          />
        ))}

        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: ` ${unit}`,
            tickCount: 3,
            tick: {
              width: 100,
            },
          },
        })}
        <ChartTooltip content={<CustomTooltip denominator={denominator} />} />
      </BarChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  denominator: mainDenominator,
}: TooltipProps<number, string> & { denominator: number }) {
  const { meta: config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null
  payload.sort((a, b) => {
    if (a.name === 'Others') return 1
    if (b.name === 'Others') return -1
    return (b.value ?? 0) - (a.value ?? 0)
  })

  return (
    <ChartTooltipWrapper>
      <div className="text-secondary">
        {formatTimestamp(label, { longMonthName: true })}
      </div>
      <HorizontalSeparator className="my-1" />
      <div>
        {payload.map((entry, index) => {
          if (entry.type === 'none') return null
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry) return null
          const value = entry.value ?? 0
          const valueInBytes = value * mainDenominator
          const { unit, denominator } = getDaDataParams(valueInBytes)
          const formattedValue = (valueInBytes / denominator).toFixed(2)
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  backgroundColor={configEntry.color}
                  type={configEntry.indicatorType}
                />
                <span className="text-secondary">{configEntry.label}</span>
              </div>
              <span className="font-medium tabular-nums text-primary">
                {formattedValue} {unit}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
