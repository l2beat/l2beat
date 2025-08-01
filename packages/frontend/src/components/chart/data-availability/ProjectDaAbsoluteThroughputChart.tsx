import type { Milestone } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
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
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './getDaDataParams'

export type ProjectChartDataWithConfiguredThroughput = [
  number,
  number | null,
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
  showTarget: boolean
  milestones: Milestone[]
  syncedUntil: UnixTime | undefined
}

export function ProjectDaAbsoluteThroughputChart({
  dataWithConfiguredThroughputs,
  isLoading,
  projectId,
  showMax,
  showTarget,
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
          project: value !== null ? value / denominator : null,
          projectTarget: target !== null ? target / denominator : null,
          projectMax: max !== null ? max / denominator : null,
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
        {showTarget && (
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
          filterNull={false}
          content={<ProjectDaThroughputCustomTooltip unit={unit} />}
        />
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: ` ${unit}`,
            tickCount: 4,
          },
          syncedUntil,
        })}
      </AreaChart>
    </ChartContainer>
  )
}

export function ProjectDaThroughputCustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
  const { meta: config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
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
                <span className="font-medium text-label-value-14">
                  {configEntry.label}
                </span>
              </div>
              {(entry.value === null || entry.value === undefined) &&
              configEntry.label === 'Actual data size' ? (
                <span className="font-medium text-label-value-15 text-primary tabular-nums">
                  No data
                </span>
              ) : (
                <span className="font-medium text-label-value-15 text-primary tabular-nums">
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
          color: 'var(--chart-ethereum)',
          indicatorType: { shape: 'line' },
        },
        projectTarget: {
          label: 'Target capacity',
          color: 'var(--chart-ethereum-secondary)',
          indicatorType: { shape: 'line', strokeDasharray: '9 3' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'var(--chart-ethereum)',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'celestia':
      return {
        project: {
          label: 'Actual data size',
          color: 'var(--chart-fuchsia)',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'var(--chart-fuchsia)',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'avail':
      return {
        project: {
          label: 'Actual data size',
          color: 'var(--chart-sky)',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'var(--chart-sky)',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    case 'eigenda':
      return {
        project: {
          label: 'Actual data size',
          color: 'var(--chart-lime)',
          indicatorType: { shape: 'line' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'var(--chart-lime)',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      } satisfies ChartMeta
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
