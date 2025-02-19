'use client'

import type { DaLayerThroughput } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { round } from 'lodash'
import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import { getXAxisProps } from '~/components/core/chart/get-x-axis-props'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import type { ProjectDaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-project-da-throughput-chart'
import { formatBytes } from '~/server/features/data-availability/throughput/utils/formatBytes'
import { formatTimestamp } from '~/utils/dates'

interface Props {
  data: ProjectDaThroughputDataPoint[] | undefined
  projectId: ProjectId
  isLoading: boolean
  throughput: DaLayerThroughput[]
}
export function ProjectDaAbsoluteThroughputChart({
  data,
  isLoading,
  projectId,
  throughput,
}: Props) {
  const processedThroughputs = throughput
    .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .map((throughput, index, arr) => {
      const untilTimestamp = arr[index + 1]?.sinceTimestamp ?? Infinity

      const batchesPerDay = UnixTime.DAY / throughput.frequency
      const maxDaily = round(throughput.size * batchesPerDay * 1024, 2)
      const targetDaily = throughput.target
        ? round(throughput.target * batchesPerDay * 1024, 2)
        : null

      return {
        ...throughput,
        untilTimestamp,
        maxDaily,
        targetDaily,
      }
    })

  const chartData = useMemo(() => {
    return data?.map(([timestamp, value]) => {
      const config = processedThroughputs.find(
        ({ sinceTimestamp, untilTimestamp }) =>
          timestamp >= sinceTimestamp && timestamp < untilTimestamp,
      )

      return {
        timestamp,
        project: value ?? 0,
        projectTarget: config?.targetDaily ?? null,
        projectMax: config?.maxDaily ?? null,
      }
    })
  }, [data, processedThroughputs])

  const projectChartConfig = getProjectChartConfig(projectId)

  return (
    <ChartContainer
      config={projectChartConfig}
      className="mb-2"
      isLoading={isLoading}
    >
      <LineChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="project"
          isAnimationActive={false}
          stroke={projectChartConfig.project?.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="projectTarget"
          isAnimationActive={false}
          stroke={projectChartConfig.projectTarget?.color}
          strokeWidth={2}
          strokeDasharray={projectChartConfig.projectTarget?.dashArray}
          dot={false}
        />
        <Line
          dataKey="projectMax"
          isAnimationActive={false}
          stroke={projectChartConfig.projectMax?.color}
          strokeWidth={2}
          strokeDasharray={projectChartConfig.projectMax?.dashArray}
          dot={false}
        />
        <CartesianGrid vertical={false} horizontal={true} />
        <XAxis {...getXAxisProps(chartData)} />
        <YAxis
          tickLine={false}
          axisLine={false}
          mirror
          tickCount={3}
          tick={{
            width: 100,
            dy: -10,
          }}
          tickFormatter={formatBytes}
        />
      </LineChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <div className={tooltipContentVariants()}>
      <div className="text-secondary">{formatTimestamp(label)}</div>
      <HorizontalSeparator className="my-1" />
      <div className="grid">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          assert(configEntry, 'Config entry not found')
          const hasDashedLine = !!configEntry?.dashArray

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                {hasDashedLine ? (
                  <svg width="20" height="10" viewBox="0 0 20 10">
                    <line
                      x1="0"
                      y1="5"
                      x2="20"
                      y2="5"
                      stroke={configEntry.color}
                      strokeWidth={3}
                      strokeDasharray={configEntry.dashArray}
                    />
                  </svg>
                ) : (
                  <div
                    className="size-3 shrink-0 rounded"
                    style={{ backgroundColor: entry.color }}
                  />
                )}

                <span className="text-secondary">{configEntry.label}</span>
              </div>
              <span className="font-medium tabular-nums text-primary">
                {formatBytes(entry.value ?? 0)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getProjectChartConfig(projectId: ProjectId): ChartConfig {
  switch (projectId) {
    case 'ethereum':
      return {
        project: {
          label: 'Ethereum',
          color: 'hsl(var(--chart-ethereum))',
          dashArray: 'solid',
        },
        projectTarget: {
          label: 'Ethereum Target',
          color: 'hsl(var(--chart-ethereum-secondary))',
          dashArray: '9 3',
        },
        projectMax: {
          label: 'Ethereum Max',
          color: 'hsl(var(--chart-ethereum))',
          dashArray: '3 3',
        },
      }
    case 'celestia':
      return {
        project: {
          label: 'Celestia',
          color: 'hsl(var(--chart-da-celestia))',
          dashArray: 'solid',
        },
        projectMax: {
          label: 'Celestia Max',
          color: 'hsl(var(--chart-da-celestia))',
          dashArray: '3 3',
        },
      }
    case 'avail':
      return {
        project: {
          label: 'Avail',
          color: 'hsl(var(--chart-da-avail))',
          dashArray: 'solid',
        },
        projectMax: {
          label: 'Avail Max',
          color: 'hsl(var(--chart-da-avail))',
          dashArray: '3 3',
        },
      }
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
