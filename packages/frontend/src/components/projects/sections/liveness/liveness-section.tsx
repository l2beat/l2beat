import type { Milestone } from '@l2beat/config'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { TrackedTransactionsByType } from '~/utils/project/costs/get-tracked-transactions'

import { ProjectLivenessChart } from '~/components/chart/liveness/project-liveness-chart'
import { TrackedTransactions } from '../costs/tracked-transactions'
import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'

export interface LivenessSectionProps extends ProjectSectionProps {
  projectId: string
  milestones: Milestone[]
  trackedTransactions: TrackedTransactionsByType
}

export function LivenessSection({
  projectId,
  milestones,
  trackedTransactions,
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
      <ProjectLivenessChart milestones={milestones} projectId={projectId} />
      <HorizontalSeparator className="my-4" />
      <TrackedTransactions {...trackedTransactions} />
    </ProjectSection>
  )
}
