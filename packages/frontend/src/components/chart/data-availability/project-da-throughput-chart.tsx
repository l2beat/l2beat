'use client'

import type { DaLayerThroughput } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ChartTimeRange } from '~/components/core/chart/chart-time-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import { ProjectDaAbsoluteThroughputChart } from './project-da-absolute-throughput-chart'

export function ProjectDaThroughputChart({
  projectId,
  throughput,
}: { projectId: ProjectId; throughput: DaLayerThroughput[] }) {
  const [range, setRange] = useState<DaThroughputTimeRange>('30d')
  const { data, isLoading } = api.da.projectChart.useQuery({
    range,
    projectId,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.map(([timestamp]) => ({ timestamp }))),
    [data],
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
        data={data}
        throughput={throughput}
        isLoading={isLoading}
      />
    </div>
  )
}
