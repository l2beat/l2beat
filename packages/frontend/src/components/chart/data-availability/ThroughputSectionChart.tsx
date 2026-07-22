import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useIncludeLayer2sOnly } from '~/pages/data-availability/throughput/components/DaThroughputContext'
import type { ProjectDaThroughputChartPoint } from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
import { useTRPC } from '~/trpc/React'
import {
  type ChartRange,
  type ChartResolution,
  optionToRange,
  rangeToResolution,
} from '~/utils/range/range'
import { ChartDataSourceInfo } from '../ChartDataSourceInfo'
import { DaThroughputByProjectChart } from './DaThroughputByProjectChart'
import { EthereumProjectsOnlyCheckbox } from './EthereumProjectsOnlyCheckbox'
import {
  type ProjectChartDataWithConfiguredThroughput,
  ProjectDaAbsoluteThroughputChart,
} from './ProjectDaAbsoluteThroughputChart'
import { DaThroughputTimeRangeValues } from './timeRangeValues'

interface Props {
  project: ChartProject
  configuredThroughputs: DaLayerThroughput[]
  customColors: Record<string, string> | undefined
  milestones: Milestone[]
}

export function ThroughputSectionChart({
  project,
  configuredThroughputs,
  customColors,
  milestones,
}: Props) {
  const trpc = useTRPC()
  const { includeLayer2sOnly, setIncludeLayer2sOnly } = useIncludeLayer2sOnly()
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))

  const { data, isLoading } = useQuery(
    trpc.da.projectCharts.queryOptions({
      range,
      projectId: project.id,
      includeLayer2sOnly,
    }),
  )

  const resolution = useMemo(() => rangeToResolution(range), [range])

  const dataWithConfiguredThroughputs = getDataWithConfiguredThroughputs(
    data?.totalChart.data,
    configuredThroughputs,
    resolution,
  )

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.totalChart.data.map(([timestamp]) => ({ timestamp })),
        { bucket: resolution },
      ),
    [data, resolution],
  )

  return (
    <div>
      {project.id === 'eigenda' && (
        <ChartDataSourceInfo dataSource="API provided by EigenLayer" />
      )}
      <div className="mt-2 space-y-1">
        <EthereumProjectsOnlyCheckbox
          name="projectThroughputIncludeLayer2sOnly"
          checked={includeLayer2sOnly}
          onCheckedChange={setIncludeLayer2sOnly}
        />
        <div className="flex justify-between gap-x-1">
          <ProjectChartTimeRange timeRange={timeRange} />
          <ChartRangeControls
            name="throughput"
            value={range}
            setValue={setRange}
            options={Object.values(DaThroughputTimeRangeValues).map((v) => ({
              value: v,
              label: v.toUpperCase(),
            }))}
          />
        </div>
      </div>
      <div className="mb-2">
        <ProjectDaAbsoluteThroughputChart
          project={project}
          dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
          isLoading={isLoading}
          milestones={milestones}
          syncedUntil={data?.syncedUntil}
          resolution={resolution}
        />
      </div>
      <DaThroughputByProjectChart
        data={data?.byProjectChart.data}
        project={project}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        customColors={customColors}
        milestones={milestones}
        resolution={resolution}
      />
    </div>
  )
}

function getDataWithConfiguredThroughputs(
  data: ProjectDaThroughputChartPoint[] | undefined,
  configuredThroughputs: DaLayerThroughput[],
  resolution: ChartResolution,
): ProjectChartDataWithConfiguredThroughput[] | undefined {
  const processedConfigs = configuredThroughputs
    .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .map((config, i, arr) => {
      const batchesPerDay = UnixTime.DAY / config.frequency
      const nextConfig = arr[i + 1]
      return {
        ...config,
        sinceTimestamp: UnixTime.toStartOf(config.sinceTimestamp, 'day'),
        untilTimestamp: nextConfig
          ? UnixTime.toStartOf(nextConfig.sinceTimestamp, 'day')
          : Number.POSITIVE_INFINITY,
        maxDaily: config.size === 'NO_CAP' ? null : config.size * batchesPerDay,
        targetDaily: config.target ? config.target * batchesPerDay : null,
      }
    })

  return data?.map(([timestamp, value]) => {
    const config = processedConfigs.find(
      (c) => timestamp >= c.sinceTimestamp && timestamp < c.untilTimestamp,
    )

    return [
      timestamp,
      value,
      adjustThoughputToRange(resolution, config?.targetDaily),
      adjustThoughputToRange(resolution, config?.maxDaily),
    ]
  })
}

function adjustThoughputToRange(
  resolution: ChartResolution,
  throughput: number | null | undefined,
) {
  if (!throughput) return null

  switch (resolution) {
    case 'hour':
      return throughput / 24
    case 'six hours':
      return throughput / 4
    default:
      return throughput
  }
}
