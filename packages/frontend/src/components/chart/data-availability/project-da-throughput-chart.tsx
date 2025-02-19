'use client'

import type { DaLayerThroughput } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { round } from 'lodash'
import { useMemo, useState } from 'react'
import { ChartTimeRange } from '~/components/core/chart/chart-time-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import type { ProjectDaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-project-da-throughput-chart'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import type { ProjectChartDataWithConfiguredThroughput } from './project-da-absolute-throughput-chart'
import { ProjectDaAbsoluteThroughputChart } from './project-da-absolute-throughput-chart'

export function ProjectDaThroughputChart({
  projectId,
  configuredThroughput,
}: { projectId: ProjectId; configuredThroughput: DaLayerThroughput[] }) {
  const [range, setRange] = useState<DaThroughputTimeRange>('30d')
  const { data, isLoading } = api.da.projectChart.useQuery({
    range,
    projectId,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  const dataWithConfiguredThroughputs = getDataWithConfiguredThroughputs(
    data,
    configuredThroughput,
  )

  return (
    <div>
      <div className="mt-4 flex justify-between">
        <ChartTimeRange range={chartRange} />
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
      <ProjectDaAbsoluteThroughputChart
        projectId={projectId}
        dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
        isLoading={isLoading}
      />
    </div>
  )
}

function getDataWithConfiguredThroughputs(
  data: ProjectDaThroughputDataPoint[] | undefined,
  configuredThroughput: DaLayerThroughput[],
): ProjectChartDataWithConfiguredThroughput[] | undefined {
  const processedConfigs = configuredThroughput
    .sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .map((config, i, arr) => {
      const batchesPerDay = UnixTime.DAY / config.frequency
      const multiplier = batchesPerDay * 1024

      return {
        ...config,
        untilTimestamp: arr[i + 1]?.sinceTimestamp ?? Infinity,
        maxDaily: round(config.size * multiplier, 2),
        targetDaily: config.target
          ? round(config.target * multiplier, 2)
          : null,
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
