import type { ProjectId } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'

import type { Milestone } from '@l2beat/config'
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
import { EmeraldFillGradientDef } from '~/components/core/chart/defs/emerald-gradient-def'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/ethereum-gradient-def'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/pink-gradient-def'
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
  showMax: boolean
  milestones: Milestone[]
}

export function ProjectDaAbsoluteThroughputChart({
  dataWithConfiguredThroughputs,
  isLoading,
  projectId,
  showMax,
  milestones,
}: Props) {
  const max = useMemo(() => {
    return dataWithConfiguredThroughputs
      ? Math.max(
          ...dataWithConfiguredThroughputs.map(([_, ...rest]) =>
            Math.max(...rest.filter((x) => x !== null)),
          ),
        )
      : undefined
  }, [dataWithConfiguredThroughputs])
  const { denominator, unit } = getDaDataParams(max)

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
      milestones={milestones}
    >
      <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <defs>
          {projectId === 'ethereum' && (
            <>
              <EthereumFillGradientDef id="ethereum-fill" />
              <EthereumStrokeGradientDef id="ethereum-stroke" />
            </>
          )}
          {projectId === 'celestia' && (
            <>
              <PinkFillGradientDef id="celestia-fill" />
              <PinkStrokeGradientDef id="celestia-stroke" />
            </>
          )}
          {projectId === 'avail' && <EmeraldFillGradientDef id="avail-fill" />}
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="project"
          fill={`url(#${projectId}-fill)`}
          fillOpacity={1}
          stroke={
            projectId === 'avail'
              ? projectChartMeta.project?.color
              : `url(#${projectId}-stroke)`
          }
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
        />
        {showMax && (
          <Area
            dataKey="projectTarget"
            isAnimationActive={false}
            fillOpacity={0}
            stroke={projectChartMeta.projectTarget?.color}
            strokeWidth={2}
            strokeDasharray={
              projectChartMeta.projectTarget?.indicatorType.strokeDasharray
            }
            type="stepAfter"
            dot={false}
          />
        )}
        {showMax && (
          <Area
            dataKey="projectMax"
            isAnimationActive={false}
            fillOpacity={0}
            stroke={projectChartMeta.projectMax?.color}
            strokeWidth={2}
            strokeDasharray={
              projectChartMeta.projectMax?.indicatorType.strokeDasharray
            }
            type="stepAfter"
            dot={false}
          />
        )}
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
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
      </AreaChart>
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
      <div className="label-value-14-medium text-secondary">
        {formatTimestamp(label, { longMonthName: true })}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry) return null

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
                <span className="label-value-14-medium">
                  {configEntry.label}
                </span>
              </div>
              <span className="label-value-15-medium tabular-nums text-primary">
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
          label: 'Actual data size',
          color: 'hsl(var(--chart-ethereum))',
          indicatorType: { shape: 'line' },
        },
        projectTarget: {
          label: 'Target capacity',
          color: 'hsl(var(--chart-ethereum-secondary))',
          indicatorType: { shape: 'line', strokeDasharray: '9 3' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'hsl(var(--chart-ethereum))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'celestia':
      return {
        project: {
          label: 'Actual data size',
          color: 'hsl(var(--chart-da-celestia))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'hsl(var(--chart-da-celestia))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'avail':
      return {
        project: {
          label: 'Actual data size',
          color: 'hsl(var(--chart-emerald))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'hsl(var(--chart-emerald))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
