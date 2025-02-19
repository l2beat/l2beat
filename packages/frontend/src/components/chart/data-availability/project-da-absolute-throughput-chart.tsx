'use client'

import type { DaLayerThroughput } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { round } from 'lodash'
import { useMemo } from 'react'
import { Line, LineChart } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import type { ProjectDaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-project-da-throughput-chart'
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './get-da-data-params'

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
  const configuredThroughputs = throughput
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

  const dataWithConfig:
    | [number, number, number | null, number | null][]
    | undefined = useMemo(() => {
    return data?.map(([timestamp, value]) => {
      const config = configuredThroughputs.find(
        ({ sinceTimestamp, untilTimestamp }) =>
          timestamp >= sinceTimestamp && timestamp < untilTimestamp,
      )

      return [
        timestamp,
        value ?? 0,
        config?.targetDaily ?? null,
        config?.maxDaily ?? null,
      ]
    })
  }, [data, configuredThroughputs])

  const { denominator, unit } = getDaDataParams(dataWithConfig)

  const chartData = useMemo(() => {
    return dataWithConfig?.map(([timestamp, value, target, max]) => {
      return {
        timestamp,
        project: value / denominator,
        projectTarget: target ? target / denominator : null,
        projectMax: max ? max / denominator : null,
      }
    })
  }, [dataWithConfig, denominator])

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
          strokeDasharray={projectChartMeta.projectTarget?.dashArray}
          dot={false}
        />
        <Line
          dataKey="projectMax"
          isAnimationActive={false}
          stroke={projectChartMeta.projectMax?.color}
          strokeWidth={2}
          strokeDasharray={projectChartMeta.projectMax?.dashArray}
          dot={false}
        />
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
                {(entry.value ?? 0).toFixed(2)} {unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getProjectChartMeta(projectId: ProjectId): ChartMeta {
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
