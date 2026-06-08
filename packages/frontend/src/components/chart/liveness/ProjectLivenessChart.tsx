import type { Milestone } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { LivenessChartRangeControls } from '~/pages/scaling/liveness/components/LivenessChartRangeControls'
import { LivenessChartSubtypeControls } from '~/pages/scaling/liveness/components/LivenessChartSubtypeControls'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { getDefaultSubtype } from './getDefaultSubtype'
import { LivenessChart } from './LivenessChart'
import { LivenessChartStats } from './LivenessChartStats'

interface Props {
  project: ChartProject
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  milestones: Milestone[]
  defaultRange: ChartRange
  isArchived: boolean
  hideSubtypeSwitch?: boolean
}

export function ProjectLivenessChart({
  project,
  configuredSubtypes,
  anomalies,
  milestones,
  isArchived,
  defaultRange,
  hideSubtypeSwitch,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [subtype, setSubtype] = useState<TrackedTxsConfigSubtype>(
    getDefaultSubtype(configuredSubtypes),
  )

  const { data: chart, isLoading } = useQuery(
    trpc.liveness.projectChart.queryOptions({
      projectId: project.id,
      range,
      subtype,
    }),
  )

  const anyAnomalyLive = anomalies.some(
    (anomaly) => anomaly.subtype === subtype && anomaly.end === undefined,
  )
  const chartData = useMemo(() => {
    return chart?.data?.map(([timestamp, min, avg, max]) => {
      return {
        timestamp,
        range: min === null || max === null ? null : ([min, max] as const),
        avg,
      }
    })
  }, [chart?.data])

  const lastValidTimestamp = useMemo(() => {
    if (!chart?.data) {
      return undefined
    }
    const lastValidTimestamp = chart.data.findLast(([_, ...rest]) =>
      rest.every((v) => v !== null),
    )?.[0]

    return lastValidTimestamp
  }, [chart?.data])

  const resolution = rangeToResolution(range)
  const timeRange = getChartTimeRangeFromData(chartData, { bucket: resolution })

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'flex flex-col gap-1',
          hideSubtypeSwitch && 'flex-row justify-between',
        )}
      >
        <ProjectChartTimeRange timeRange={timeRange} />
        <ChartControlsWrapper className="flex-wrap-reverse">
          {!hideSubtypeSwitch && (
            <LivenessChartSubtypeControls
              subtype={subtype}
              setSubtype={setSubtype}
              configuredSubtypes={configuredSubtypes}
            />
          )}
          <LivenessChartRangeControls range={range} setRange={setRange} />
        </ChartControlsWrapper>
      </div>
      <div className="mt-4 mb-3">
        <LivenessChart
          data={chartData}
          isLoading={isLoading}
          project={project}
          subtype={subtype}
          milestones={milestones}
          lastValidTimestamp={lastValidTimestamp}
          anyAnomalyLive={anyAnomalyLive}
          resolution={resolution}
          tickCount={4}
        />
      </div>
      <LivenessChartStats
        isLoading={isLoading}
        stats={chart?.stats}
        anomalies={anomalies}
        configuredSubtypes={configuredSubtypes}
        isArchived={isArchived}
      />
    </div>
  )
}
