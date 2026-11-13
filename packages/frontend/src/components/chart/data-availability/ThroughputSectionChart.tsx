import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
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

type View = 'total' | 'per-project'

export function ThroughputSectionChart({
  project,
  configuredThroughputs,
  customColors,
  milestones,
}: Props) {
  const trpc = useTRPC()
  const { includeL2Only, setIncludeL2Only } = useIncludeL2Only()
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))
  const [view, setView] = useState<View>('total')

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
    <div>
      <div className="mt-2 space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <EthereumProjectsOnlyCheckbox
            name="projectThroughputIncludeL2Only"
            checked={includeL2Only}
            onCheckedChange={setIncludeL2Only}
          />
          <RadioGroup
            name="projectThroughputView"
            value={view}
            onValueChange={(value) => setView(value as View)}
          >
            <RadioGroupItem value="total">Total</RadioGroupItem>
            <RadioGroupItem value="per-project">Per project</RadioGroupItem>
          </RadioGroup>
        </div>
        <div className="flex justify-between gap-x-1">
          <ProjectChartTimeRange
            isPlaceholderData={isPlaceholderData}
            timeRange={timeRange}
          />
          <ChartRangeControls
            name="throughput"
            value={range}
            setValue={setRange}
            options={Object.values(DaThroughputTimeRangeValues).map((v) => ({
              value: v,
              label: v === 'max' ? 'Max' : v,
            }))}
          />
        </div>
      </div>
      {view === 'total' ? (
        <ProjectDaAbsoluteThroughputChart
          isPlaceholderData={isPlaceholderData}
          project={project}
          dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
          isLoading={isLoading}
          milestones={milestones}
          syncedUntil={data?.syncedUntil}
          resolution={resolution}
        />
      ) : (
        <DaThroughputByProjectChart
          isPlaceholderData={isPlaceholderData}
          data={data?.byProjectChart.data}
          project={project}
          syncedUntil={data?.syncedUntil}
          isLoading={isLoading}
          customColors={customColors}
          capacity={{
            projectId: project.id,
            data: dataWithConfiguredThroughputs,
          }}
          milestones={milestones}
          resolution={resolution}
        />
      )}
    </div>
  )
}
