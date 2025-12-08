import type { Milestone } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { LivenessChartRangeControls } from '~/pages/scaling/liveness/components/LivenessChartRangeControls'
import { LivenessChartSubtypeControls } from '~/pages/scaling/liveness/components/LivenessChartSubtypeControls'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { rangeToResolution } from '~/server/features/scaling/liveness/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { getDefaultSubtype } from './getDefaultSubtype'
import { LivenessChart } from './LivenessChart'
import { LivenessChartStats } from './LivenessChartStats'

interface Props {
  project: ChartProject
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
  milestones: Milestone[]
  defaultRange: ChartRange
  isArchived: boolean
  hideSubtypeSwitch?: boolean
}

export function ProjectLivenessChart({
  project,
  configuredSubtypes,
  anomalies,
  hasTrackedContractsChanged,
  milestones,
  isArchived,
  defaultRange,
  hideSubtypeSwitch,
}: Props) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [subtype, setSubtype] = useState<TrackedTxsConfigSubtype>(
    getDefaultSubtype(configuredSubtypes),
  )

  const { data: chart, isLoading } = api.liveness.projectChart.useQuery({
    range,
    projectId: project.id,
    subtype,
  })

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

  const timeRange = getChartTimeRangeFromData(chartData)

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
      <LivenessChart
        data={chartData}
        isLoading={isLoading}
        project={project}
        subtype={subtype}
        milestones={milestones}
        lastValidTimestamp={lastValidTimestamp}
        anyAnomalyLive={anyAnomalyLive}
        resolution={rangeToResolution(range)}
        tickCount={4}
        className="mt-4 mb-3"
      />
      <LivenessChartStats
        isLoading={isLoading}
        stats={chart?.stats}
        anomalies={anomalies}
        configuredSubtypes={configuredSubtypes}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
        isArchived={isArchived}
      />
    </div>
  )
}
