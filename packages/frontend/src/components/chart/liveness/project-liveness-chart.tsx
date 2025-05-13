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
import type { ProjectLivenessChartData } from '~/server/features/scaling/liveness/get-project-liveness-chart'

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
      chart?.data.map((dataPoint, index, arr) => {
        const [timestamp, min, avg, max] = dataPoint
        const { emptyRange, emptyAvg } = getEmptyRange(dataPoint, index, arr)
        return {
          timestamp,
          range: [min, max],
          avg,
          emptyRange,
          emptyAvg,
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

/** We want to connect values with grayed out line when there is a gap in chart data.
 * This function returns values for additional `emptyRange` and `emptyAvg` data keys
 * that we use to draw grayed out line.
 * It returns last know value before the gap and first know value after the gap, so we can draw a line between them.
 */
function getEmptyRange(
  dataPoint: ProjectLivenessChartData['data'][number],
  index: number,
  array: ProjectLivenessChartData['data'],
) {
  const [_, min, avg, max] = dataPoint
  if (min === null && avg === null && max === null) {
    return {
      emptyRange: [null, null],
      emptyAvg: null,
    }
  }
  const nextPoint = array[index + 1]
  if (nextPoint) {
    const [_, nextMin, nextAvg, nextMax] = nextPoint
    if (nextMin === null && nextAvg === null && nextMax === null) {
      return {
        emptyRange: [min, max],
        emptyAvg: avg,
      }
    }
  }
  const previousPoint = array[index - 1]
  if (previousPoint) {
    const [_, previousMin, previousAvg, previousMax] = previousPoint
    if (previousMin === null && previousAvg === null && previousMax === null) {
      return {
        emptyRange: [min, max],
        emptyAvg: avg,
      }
    }
  }
  return {
    emptyRange: [null, null],
    emptyAvg: null,
  }
}
