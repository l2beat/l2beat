import type { Milestone } from '@l2beat/config'
import { formatBytes, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import type {
  ChartMeta,
  ChartProject,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { NoDataPatternDef } from '~/components/core/chart/defs/NoDataPatternDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatRange } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'
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
  project: ChartProject
  isLoading: boolean
  milestones: Milestone[]
  syncedUntil: UnixTime | undefined
  resolution: ChartResolution
  /** For when the page already says whose data it is */
  hideProjectLogo?: boolean
  /** The hint's extra row would lift this chart's baseline above a hint-less chart beside it */
  disableLegendOnboarding?: boolean
}

const hiddenDataKeys = ['projectMax'] as const

export function ProjectDaAbsoluteThroughputChart({
  dataWithConfiguredThroughputs,
  project,
  isLoading,
  milestones,
  syncedUntil,
  resolution,
  hideProjectLogo,
  disableLegendOnboarding,
}: Props) {
  const projectChartMeta = useMemo(
    () => getProjectChartMeta(project.id),
    [project.id],
  )

  const { dataKeys, toggleDataKey } = useChartDataKeys(
    projectChartMeta,
    hiddenDataKeys,
  )
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

  return (
    <ChartContainer
      meta={projectChartMeta}
      data={chartData}
      project={hideProjectLogo ? undefined : project}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
        disableOnboarding: disableLegendOnboarding,
      }}
      milestones={milestones}
    >
      <AreaChart responsive data={chartData} margin={{ top: 20 }}>
        <defs>
          {project.id === 'ethereum' && (
            <EthereumFillGradientDef id="ethereum-fill" />
          )}
          <NoDataPatternDef />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="project"
          fill={`url(#${project.id}-fill)`}
          fillOpacity={1}
          stroke={projectChartMeta.project?.color}
          isAnimationActive={false}
          dot={false}
          hide={!dataKeys.includes('project')}
        />
        <Area
          dataKey="projectTarget"
          isAnimationActive={false}
          fillOpacity={0}
          stroke={projectChartMeta.projectTarget?.color}
          strokeDasharray={
            projectChartMeta.projectTarget?.indicatorType.strokeDasharray
          }
          type="stepAfter"
          dot={false}
          hide={!dataKeys.includes('projectTarget')}
        />
        <Area
          dataKey="projectMax"
          isAnimationActive={false}
          fillOpacity={0}
          stroke={projectChartMeta.projectMax?.color}
          strokeDasharray={
            projectChartMeta.projectMax?.indicatorType.strokeDasharray
          }
          type="stepAfter"
          dot={false}
          hide={!dataKeys.includes('projectMax')}
        />
        <ChartTooltip
          filterNull={false}
          content={
            <ProjectDaThroughputCustomTooltip
              denominator={denominator}
              resolution={resolution}
            />
          }
        />
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            unit: ` ${unit}`,
            tickCount: 4,
          }}
          syncedUntil={syncedUntil}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function ProjectDaThroughputCustomTooltip({
  payload,
  label,
  denominator,
  resolution,
}: CustomChartTooltipProps & {
  denominator: number
  resolution: ChartResolution
}) {
  const { meta: config } = useChart()
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry || entry.hide) return null

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
              ) : entry.value === null &&
                configEntry.label === 'Max capacity' ? (
                <span className="font-medium text-label-value-15 text-primary tabular-nums">
                  No cap
                </span>
              ) : (
                <span className="font-medium text-label-value-15 text-primary tabular-nums">
                  {formatBytes((entry.value ?? 0) * denominator)}
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
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
