import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { DurationCell } from '~/app/(side-nav)/scaling/finality/_components/table/duration-cell'
import { AnomalyIndicator } from '~/app/(side-nav)/scaling/liveness/_components/anomaly-indicator'
import { ProjectLivenessChart } from '~/components/chart/liveness/project-liveness-chart'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  disableAnomalies: boolean
  hasTrackedContractsChanged: boolean
  batchSubmissionsAvg: number | undefined
  stateUpdatesAvg: number | undefined
  proofSubmissionsAvg: number | undefined
}

export function LivenessSection({
  projectId,
  configuredSubtypes,
  anomalies,
  batchSubmissionsAvg,
  stateUpdatesAvg,
  proofSubmissionsAvg,
  disableAnomalies,
  hasTrackedContractsChanged,
  ...sectionProps
}: LivenessSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-base">
        The chart illustrates how &quot;live&quot; the project&apos;s operators
        are by displaying how frequently they submit transactions of the
        selected type and if these intervals deviate from their typical
        schedule.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectLivenessChart
        projectId={projectId}
        configuredSubtypes={configuredSubtypes}
      />
      <ChartStats className="mt-4">
        {batchSubmissionsAvg && (
          <ChartStatsItem label="Avg. tx data subs. interval">
            <DurationCell durationInSeconds={batchSubmissionsAvg} />
          </ChartStatsItem>
        )}
        {proofSubmissionsAvg && (
          <ChartStatsItem label="Avg. proof subs. interval">
            <DurationCell durationInSeconds={proofSubmissionsAvg} />
          </ChartStatsItem>
        )}
        {stateUpdatesAvg && (
          <ChartStatsItem label="Avg. state updates interval">
            <DurationCell durationInSeconds={stateUpdatesAvg} />
          </ChartStatsItem>
        )}
        {!disableAnomalies && (
          <ChartStatsItem label="Past 30 days anomalies">
            <AnomalyIndicator
              anomalies={anomalies}
              hasTrackedContractsChanged={hasTrackedContractsChanged}
            />
          </ChartStatsItem>
        )}
      </ChartStats>
    </ProjectSection>
  )
}
