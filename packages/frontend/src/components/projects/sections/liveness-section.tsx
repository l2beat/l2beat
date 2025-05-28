import type { Milestone } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { LivenessAnomaly } from 'rewrite/src/server/features/scaling/liveness/types'
import { ProjectLivenessChart } from '~/components/chart/liveness/project-liveness-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/get-tracked-transactions'
import { TrackedTransactions } from './costs/tracked-transactions'
import { ProjectSection } from './project-section'
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
