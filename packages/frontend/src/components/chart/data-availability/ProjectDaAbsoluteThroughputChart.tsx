import type { Milestone } from '@l2beat/config'
import { formatBytes, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
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

type SeriesKey = 'project' | 'projectTarget' | 'projectMax'
type ChartRow = { timestamp: number } & Record<SeriesKey, number | null>

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

  const series: ChartSeries<SeriesKey, ChartRow>[] = [
    {
      key: 'project',
      fill: CHART_GRADIENTS.ethereum.fill,
      stroke: projectChartMeta.project?.color,
    },
    {
      key: 'projectTarget',
      stroke: projectChartMeta.projectTarget?.color,
      strokeDasharray:
        projectChartMeta.projectTarget?.indicatorType.strokeDasharray,
      curve: 'stepAfter',
    },
    {
      key: 'projectMax',
      stroke: projectChartMeta.projectMax?.color,
      strokeDasharray:
        projectChartMeta.projectMax?.indicatorType.strokeDasharray,
      curve: 'stepAfter',
    },
  ]

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
      legend
    >
      <TimeSeriesChart
        data={chartData}
        series={series}
        ariaLabel="Data throughput"
        syncedUntil={syncedUntil}
        yAxis={{ unit: ` ${unit}`, tickCount: 4 }}
        renderTooltip={(row, keys) => (
          <ProjectDaThroughputCustomTooltip
            row={row}
            keys={keys}
            denominator={denominator}
            resolution={resolution}
          />
        )}
      />
    </ChartContainer>
  )
}

function ProjectDaThroughputCustomTooltip({
  row,
  keys,
  denominator,
  resolution,
}: {
  row: ChartRow
  keys: SeriesKey[]
  denominator: number
  resolution: ChartResolution
}) {
  const label = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {getTooltipEntries(row, keys).map((entry, index) => {
          return (
            <ChartTooltipRow
              key={index}
              name={entry.name}
              gap="gap-x-6"
              wrapLabel={false}
            >
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.value !== null
                  ? formatBytes(entry.value * denominator)
                  : entry.name === 'project'
                    ? 'No data'
                    : entry.name === 'projectMax'
                      ? 'No cap'
                      : formatBytes(0)}
              </span>
            </ChartTooltipRow>
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
