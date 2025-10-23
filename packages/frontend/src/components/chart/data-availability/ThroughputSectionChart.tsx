import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { useIncludeScalingOnly } from '~/pages/data-availability/throughput/components/DaThroughputContext'
import type { ProjectDaThroughputChartPoint } from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
import {
  type DaThroughputTimeRange,
  DaThroughputTimeRangeValues,
  rangeToResolution,
} from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import { ChartDataSourceInfo } from '../ChartDataSourceInfo'
import { DaThroughputByProjectChart } from './DaThroughputByProjectChart'
import { EthereumProjectsOnlyCheckbox } from './EthereumProjectsOnlyCheckbox'
import {
  type ProjectChartDataWithConfiguredThroughput,
  ProjectDaAbsoluteThroughputChart,
} from './ProjectDaAbsoluteThroughputChart'

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
  const { includeScalingOnly, setIncludeScalingOnly } = useIncludeScalingOnly()
  const [range, setRange] = useState<DaThroughputTimeRange>('1y')

  const { data, isLoading } = api.da.projectCharts.useQuery({
    range: { type: range },
    projectId: project.id,
    includeScalingOnly,
  })
  const dataWithConfiguredThroughputs = getDataWithConfiguredThroughputs(
    data?.totalChart.data,
    configuredThroughputs,
    range,
  )

  const chartRange = useMemo(
    () =>
      getChartRange(
        data?.totalChart.data.map(([timestamp]) => ({ timestamp })),
      ),
    [data],
  )

  const resolution = useMemo(() => rangeToResolution({ type: range }), [range])

  return (
    <div>
      {project.id === 'eigenda' && (
        <ChartDataSourceInfo dataSource="API provided by EigenLayer" />
      )}
      <div className="mt-2 space-y-1">
        <EthereumProjectsOnlyCheckbox
          name="projectThroughputIncludeScalingOnly"
          checked={includeScalingOnly}
          onCheckedChange={setIncludeScalingOnly}
        />
        <div className="flex justify-between gap-x-1">
          <ProjectChartTimeRange range={chartRange} />
          <ChartTimeRangeControls
            name="Range"
            value={range}
            setValue={setRange}
            options={Object.values(DaThroughputTimeRangeValues).map((v) => ({
              value: v,
              label: v.toUpperCase(),
            }))}
          />
        </div>
      </div>
      <ProjectDaAbsoluteThroughputChart
        project={project}
        dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
        isLoading={isLoading}
        milestones={milestones}
        syncedUntil={data?.syncedUntil}
        resolution={resolution}
      />
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
  range: DaThroughputTimeRange,
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
      adjustThoughputToRange(range, config?.targetDaily),
      adjustThoughputToRange(range, config?.maxDaily),
    ]
  })
}

function adjustThoughputToRange(
  range: DaThroughputTimeRange,
  throughput: number | null | undefined,
) {
  if (!throughput) return null

  switch (range) {
    case '7d':
      return throughput / 24
    case '30d':
    case '90d':
      return throughput / 4
    default:
      return throughput
  }
}
