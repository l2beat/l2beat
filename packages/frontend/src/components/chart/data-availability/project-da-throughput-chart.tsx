'use client'

import type { DaLayerThroughput } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { Checkbox } from '~/components/core/checkbox'
import type { ProjectDaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-project-da-throughput-chart'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import type { ProjectChartDataWithConfiguredThroughput } from './project-da-absolute-throughput-chart'
import { ProjectDaAbsoluteThroughputChart } from './project-da-absolute-throughput-chart'

export function ProjectDaThroughputChart({
  projectId,
  configuredThroughputs,
}: { projectId: ProjectId; configuredThroughputs: DaLayerThroughput[] }) {
  const [range, setRange] = useState<DaThroughputTimeRange>('30d')
  const [showMax, setShowMax] = useState(false)

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
    configuredThroughputs,
  )

  return (
    <div>
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <Checkbox
            name="showMainnetActivity"
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
        projectId={projectId}
        dataWithConfiguredThroughputs={dataWithConfiguredThroughputs}
        isLoading={isLoading}
        showMax={showMax}
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

      return {
        ...config,
        untilTimestamp: arr[i + 1]?.sinceTimestamp ?? Infinity,
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
