import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useTRPC } from '~/trpc/React'
import {
  type ChartRange,
  optionToRange,
  rangeToResolution,
} from '~/utils/range/range'
import { DaThroughputByProjectChart } from './DaThroughputByProjectChart'
import { EthereumProjectsOnlyCheckbox } from './EthereumProjectsOnlyCheckbox'
import { getDataWithConfiguredThroughputs } from './getDataWithConfiguredThroughputs'
import { useIncludeL2Only } from './IncludeL2OnlyContext'
import { ProjectDaAbsoluteThroughputChart } from './ProjectDaAbsoluteThroughputChart'
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
  const { includeL2Only, setIncludeL2Only } = useIncludeL2Only()
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))

  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.da.projectCharts,
    { range, projectId: project.id, includeL2Only },
  )

  const resolution = useMemo(
    () => rangeToResolution(shownInput.range),
    [shownInput.range],
  )

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
    <ChartShowsPreviousData value={isPlaceholderData}>
      <div>
        <div className="mt-2 space-y-1">
          <EthereumProjectsOnlyCheckbox
            name="projectThroughputIncludeL2Only"
            checked={includeL2Only}
            onCheckedChange={setIncludeL2Only}
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
    </ChartShowsPreviousData>
  )
}
