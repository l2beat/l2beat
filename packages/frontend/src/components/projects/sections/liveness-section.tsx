import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { ProjectLivenessChart } from '~/components/chart/liveness/project-liveness-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { AnomalyIndicator } from '~/app/(side-nav)/scaling/liveness/_components/anomaly-indicator'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  batchSubmissionsAvg: number | undefined
  stateUpdatesAvg: number | undefined
  proofSubmissionsAvg: number | undefined
}

export function LivenessSection({
  projectId,
  configuredSubtypes,
  anomalies,
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
        <ChartStatsItem label="Past 30 days anomalies">
          <AnomalyIndicator
            anomalies={anomalies}
            showComingSoon={false}
            hasTrackedContractsChanged={false}
          />
        </ChartStatsItem>
      </ChartStats>
    </ProjectSection>
  )
}
