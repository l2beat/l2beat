import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { Checkbox } from '~/components/core/checkbox'
import type { ProjectDaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-project-da-throughput-chart'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import type { ProjectChartDataWithConfiguredThroughput } from './project-da-absolute-throughput-chart'
import { ProjectDaAbsoluteThroughputChart } from './project-da-absolute-throughput-chart'

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
            options={Object.values(DaThroughputTimeRange.Enum).map((v) => ({
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
      />
    </div>
  )
}

function getDataWithConfiguredThroughputs(
  data: ProjectDaThroughputDataPoint[] | undefined,
  configuredThroughputs: DaLayerThroughput[],
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
      config?.targetDaily ?? null,
      config?.maxDaily ?? null,
    ]
  })
}
