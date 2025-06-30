import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import type { ProjectDaThroughputDataPoint } from '~/server/features/data-availability/throughput/getProjectDaThroughputChart'
import {
  type DaThroughputTimeRange,
  DaThroughputTimeRangeValues,
} from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import type { ProjectChartDataWithConfiguredThroughput } from './ProjectDaAbsoluteThroughputChart'
import { ProjectDaAbsoluteThroughputChart } from './ProjectDaAbsoluteThroughputChart'

interface Props {
  daLayer: ProjectId
  configuredThroughputs: DaLayerThroughput[]
  milestones: Milestone[]
  range: DaThroughputTimeRange
  setRange: (range: DaThroughputTimeRange) => void
  showMax: boolean
  setShowMax: (showMax: boolean) => void
}

export function ThroughputSectionAbsoluteChart({
  daLayer,
  configuredThroughputs,
  milestones,
  range,
  setRange,
  showMax,
  setShowMax,
}: Props) {
  const { data, isLoading } = api.da.projectChart.useQuery({
    range,
    projectId: daLayer,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.chart.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  const dataWithConfiguredThroughputs = getDataWithConfiguredThroughputs(
    data?.chart,
    configuredThroughputs,
    range,
  )

  return (
    <div>
      <div className="mt-4 mb-3 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <Checkbox
            name="showMaximumThroughput"
            checked={showMax}
            onCheckedChange={(state) => setShowMax(!!state)}
          >
            Show maximum
          </Checkbox>
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
        projectId={daLayer}
        dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
        isLoading={isLoading}
        showMax={showMax}
        milestones={milestones}
        syncedUntil={data?.syncedUntil}
      />
    </div>
  )
}

function getDataWithConfiguredThroughputs(
  data: ProjectDaThroughputDataPoint[] | undefined,
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
          : Infinity,
        maxDaily: config.size * batchesPerDay,
        targetDaily: config.target ? config.target * batchesPerDay : null,
      }
    })

  return data?.map(([timestamp, value]) => {
    const config = processedConfigs.find(
      (c) => timestamp >= c.sinceTimestamp && timestamp < c.untilTimestamp,
    )

    return [
      timestamp,
      value ?? 0,
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
