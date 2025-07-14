import type { Milestone } from '@l2beat/config'
import { type TrackedTxsConfigSubtype, pluralize } from '@l2beat/shared-pure'
import { LiveIndicator } from '~/components/LiveIndicator'
import { ProjectLivenessChart } from '~/components/chart/liveness/ProjectLivenessChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { AnomalyText } from '~/pages/scaling/liveness/components/AnomalyText'
import { NoAnomaliesState } from '~/pages/scaling/liveness/components/NoRecentAnomaliesState'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import { ProjectSection } from './ProjectSection'
import { TrackedTransactions } from './costs/TrackedTransactions'
import type { ProjectSectionProps } from './types'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  configuredSubtypes: TrackedTxsConfigSubtype[]
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
  trackedTransactions: TrackedTransactionsByType
  milestones: Milestone[]
}

export function LivenessSection({
  projectId,
  configuredSubtypes,
  anomalies,
  hasTrackedContractsChanged,
  trackedTransactions,
  milestones,
  ...sectionProps
}: LivenessSectionProps) {
  const ongoingAnomalies = anomalies.filter((a) => a.end === undefined)
  return (
    <ProjectSection {...sectionProps}>
      <p className="mb-4 text-base">
        This section shows how &quot;live&quot; the project&apos;s operators are
        by displaying how frequently they submit transactions of the selected
        type. It also highlights anomalies - significant deviations from their
        typical schedule.
      </p>
      <OngoingAnomalies anomalies={ongoingAnomalies} />

      <HorizontalSeparator className="my-4" />
      <ProjectLivenessChart
        projectId={projectId}
        configuredSubtypes={configuredSubtypes}
        anomalies={anomalies}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
        milestones={milestones}
      />
      <div className="mt-4">
        <TrackedTransactions {...trackedTransactions} />
      </div>
    </ProjectSection>
  )
}

export function OngoingAnomalies({
  anomalies,
}: { anomalies: LivenessAnomaly[] }) {
  if (anomalies.length === 0) {
    return <NoAnomaliesState className="rounded-lg!" type="ongoing" />
  }

  return (
    <div className="rounded-lg bg-surface-secondary px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <LiveIndicator size="md" />
        <h3 className="font-medium text-base text-negative uppercase">
          Ongoing {pluralize(anomalies.length, 'anomaly', 'anomalies')}
        </h3>
      </div>
      {anomalies.map((anomaly) => (
        <>
          <AnomalyText anomaly={anomaly} />
          <HorizontalSeparator className="my-2 last:hidden" />
        </>
      ))}
    </div>
  )
}
