'use client'

import type { ProjectId } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Line, LineChart } from 'recharts'
import type { TooltipProps } from 'recharts'

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
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './get-da-data-params'

export type ProjectChartDataWithConfiguredThroughput = [
  number,
  number,
  number | null,
  number | null,
]
interface Props {
  dataWithConfiguredThroughputs:
    | ProjectChartDataWithConfiguredThroughput[]
    | undefined
  projectId: ProjectId
  isLoading: boolean
}
export function ProjectDaAbsoluteThroughputChart({
  dataWithConfiguredThroughputs,
  isLoading,
  projectId,
}: Props) {
  const { denominator, unit } = getDaDataParams(dataWithConfiguredThroughputs)

  const chartData = useMemo(() => {
    return dataWithConfiguredThroughputs?.map(
      ([timestamp, value, target, max]) => {
        return {
          timestamp,
          project: value / denominator,
          projectTarget: target ? target / denominator : null,
          projectMax: max ? max / denominator : null,
        }
      },
    )
  }, [dataWithConfiguredThroughputs, denominator])

  const projectChartMeta = getProjectChartMeta(projectId)

  return (
    <ChartContainer
      meta={projectChartMeta}
      data={chartData}
      className="mb-2"
      isLoading={isLoading}
    >
      <LineChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="project"
          isAnimationActive={false}
          stroke={projectChartMeta.project?.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="projectTarget"
          isAnimationActive={false}
          stroke={projectChartMeta.projectTarget?.color}
          strokeWidth={2}
          strokeDasharray={
            projectChartMeta.projectTarget?.indicatorType.strokeDasharray
          }
          dot={false}
        />
        <Line
          dataKey="projectMax"
          isAnimationActive={false}
          stroke={projectChartMeta.projectMax?.color}
          strokeWidth={2}
          strokeDasharray={
            projectChartMeta.projectMax?.indicatorType.strokeDasharray
          }
          dot={false}
        />
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: ` ${unit}`,
            tick: {
              width: 100,
            },
          },
        })}
      </LineChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
  const { meta: config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="text-secondary">{formatTimestamp(label)}</div>
      <HorizontalSeparator className="my-1" />
      <div className="grid">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          assert(configEntry, 'Config entry not found')

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={configEntry.indicatorType}
                  backgroundColor={configEntry.color}
                />
                <span className="text-secondary">{configEntry.label}</span>
              </div>
              <span className="font-medium tabular-nums text-primary">
                {(entry.value ?? 0).toFixed(2)} {unit}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}

function getProjectChartMeta(projectId: ProjectId) {
  switch (projectId) {
    case 'ethereum':
      return {
        project: {
          label: 'Ethereum',
          color: 'hsl(var(--chart-ethereum))',
          indicatorType: { shape: 'line' },
        },
        projectTarget: {
          label: 'Ethereum Target',
          color: 'hsl(var(--chart-ethereum-secondary))',
          indicatorType: { shape: 'line', strokeDasharray: '9 3' },
        },
        projectMax: {
          label: 'Ethereum Max',
          color: 'hsl(var(--chart-ethereum))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'celestia':
      return {
        project: {
          label: 'Celestia',
          color: 'hsl(var(--chart-da-celestia))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Celestia Max',
          color: 'hsl(var(--chart-da-celestia))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'avail':
      return {
        project: {
          label: 'Avail',
          color: 'hsl(var(--chart-da-avail))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Avail Max',
          color: 'hsl(var(--chart-da-avail))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
