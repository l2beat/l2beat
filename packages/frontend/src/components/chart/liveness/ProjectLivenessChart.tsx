import type { Milestone } from '@l2beat/config'
import { type TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'React'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { LivenessChartSubtypeControls } from '~/pages/scaling/liveness/components/LivenessChartSubtypeControls'
import { LivenessChartTimeRangeControls } from '~/pages/scaling/liveness/components/LivenessChartTimeRangeControls'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import type { LivenessChartTimeRange } from '~/server/features/scaling/liveness/utils/chartRange'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { getDefaultSubtype } from './getDefaultSubtype'
import { LivenessChart } from './LivenessChart'
import { LivenessChartStats } from './LivenessChartStats'

interface Props {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
  milestones: Milestone[]
}

export function ProjectLivenessChart({
  projectId,
  configuredSubtypes,
  anomalies,
  hasTrackedContractsChanged,
  milestones,
}: Props) {
  const [timeRange, setTimeRange] = useState<LivenessChartTimeRange>('30d')
  const [subtype, setSubtype] = useState<TrackedTxsConfigSubtype>(
    getDefaultSubtype(configuredSubtypes),
  )

  const { data: chart, isLoading } = api.liveness.projectChart.useQuery({
    range: timeRange,
    projectId,
    subtype,
  })

  const chartData = useMemo(() => {
    let rawChartData = chart?.data
    const anyAnomalyLive = isAnyAnomalyLive(anomalies, subtype)

    if (!anyAnomalyLive) {
      // If there is no anomaly live, remove all data after the last valid timestamp
      const lastValidTimestamp = rawChartData?.findLastIndex(
        ([_, min, avg, max]) => min !== null && avg !== null && max !== null,
      )
      if (lastValidTimestamp !== undefined && lastValidTimestamp !== -1) {
        rawChartData = rawChartData?.slice(0, lastValidTimestamp + 1)
      }
    }
    return rawChartData?.map(([timestamp, min, avg, max]) => {
      return {
        timestamp,
        range: [min, max],
        avg,
      }
    })
  }, [chart?.data, anomalies, subtype])

  const chartRange = getChartRange(chartData)

  return (
    <section className="flex flex-col">
      <ProjectChartTimeRange range={chartRange} />
      <ChartControlsWrapper className="mt-4 mb-2">
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
      <LivenessChart
        data={chartData}
        isLoading={isLoading}
        subtype={subtype}
        milestones={milestones}
      />
      <LivenessChartStats
        timeRange={timeRange}
        isLoading={isLoading}
        stats={chart?.stats}
        anomalies={anomalies}
        configuredSubtypes={configuredSubtypes}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
      />
    </section>
  )
}

function isAnyAnomalyLive(
  anomalies: LivenessAnomaly[],
  subtype: TrackedTxsConfigSubtype,
) {
  const NOW = UnixTime.now()
  const subtypeAnomalies = anomalies.filter(
    (anomaly) => anomaly.type === subtype,
  )
  return subtypeAnomalies.some(
    (anomaly) =>
      NOW - 4 * UnixTime.HOUR <= anomaly.timestamp + anomaly.durationInSeconds,
  )
}
