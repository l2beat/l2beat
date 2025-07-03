import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'

import type { Milestone } from '@l2beat/config'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { FuchsiaFillGradientDef } from '~/components/core/chart/defs/FuchsiaGradientDef'
import { LimeFillGradientDef } from '~/components/core/chart/defs/LimeGradientDef'
import { SkyFillGradientDef } from '~/components/core/chart/defs/SkyGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/GetCommonChartComponents'
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './getDaDataParams'

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
  syncedUntil: UnixTime | undefined
}

export function ProjectDaAbsoluteThroughputChart({
  dataWithConfiguredThroughputs,
  isLoading,
  projectId,
  showMax,
  milestones,
  syncedUntil,
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
            <EthereumFillGradientDef id="ethereum-fill" />
          )}
          {projectId === 'celestia' && (
            <FuchsiaFillGradientDef id="celestia-fill" />
          )}
          {projectId === 'avail' && <SkyFillGradientDef id="avail-fill" />}
          {projectId === 'eigenda' && <LimeFillGradientDef id="eigenda-fill" />}
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="project"
          fill={`url(#${projectId}-fill)`}
          fillOpacity={1}
          stroke={projectChartMeta.project?.color}
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
        <ChartTooltip
          content={<CustomTooltip unit={unit} syncedUntil={syncedUntil} />}
        />
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: ` ${unit}`,
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
  syncedUntil,
}: TooltipProps<number, string> & { unit: string; syncedUntil?: UnixTime }) {
  const { meta: config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="label-value-14-medium text-secondary">
        {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry) return null

          const isSynced = syncedUntil && label <= syncedUntil

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
              {!isSynced && configEntry.label === 'Actual data size' ? (
                <span className="label-value-15-medium text-primary tabular-nums">
                  Not synced
                </span>
              ) : (
                <span className="label-value-15-medium text-primary tabular-nums">
                  {(entry.value ?? 0).toFixed(2)} {unit}
                </span>
              )}
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
          color: 'hsl(var(--chart-fuchsia))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'hsl(var(--chart-fuchsia))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'avail':
      return {
        project: {
          label: 'Actual data size',
          color: 'hsl(var(--chart-sky))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'hsl(var(--chart-sky))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'eigenda':
      return {
        project: {
          label: 'Actual data size',
          color: 'hsl(var(--chart-lime))',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'hsl(var(--chart-lime))',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
