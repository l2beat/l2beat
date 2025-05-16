'use client'

import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { LivenessChartSubtypeControls } from '~/app/(side-nav)/scaling/liveness/_components/liveness-chart-subtype-controls'
import { LivenessChartTimeRangeControls } from '~/app/(side-nav)/scaling/liveness/_components/liveness-chart-time-range-controls'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import type { LivenessChartTimeRange } from '~/server/features/scaling/liveness/utils/chart-range'
import { api } from '~/trpc/react'
import { ChartControlsWrapper } from '../../core/chart/chart-controls-wrapper'
import { LivenessChart } from './liveness-chart'

interface Props {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
}

export function ProjectLivenessChart({ projectId, configuredSubtypes }: Props) {
  const [timeRange, setTimeRange] = useState<LivenessChartTimeRange>('30d')
  const [subtype, setSubtype] = useState<TrackedTxsConfigSubtype>(
    configuredSubtypes.includes('batchSubmissions')
      ? 'batchSubmissions'
      : configuredSubtypes.includes('proofSubmissions')
        ? 'proofSubmissions'
        : 'stateUpdates',
  )

  const { data: chart, isLoading } = api.liveness.projectChart.useQuery({
    range: timeRange,
    projectId,
    subtype,
  })

  const chartData = useMemo(
    () =>
      chart?.data.map(([timestamp, min, avg, max]) => {
        return {
          timestamp,
          range: [min, max],
          avg,
        }
      }),
    [chart?.data],
  )

  const chartRange = getChartRange(chartData)

  return (
    <section className="flex flex-col">
      <ProjectChartTimeRange range={chartRange} />
      <ChartControlsWrapper className="mb-2 mt-4">
        <LivenessChartSubtypeControls
          subtype={subtype}
          setSubtype={setSubtype}
          configuredSubtypes={configuredSubtypes}
        />
        <LivenessChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
      <LivenessChart data={chartData} isLoading={isLoading} />
    </section>
  )
}
