import type { Milestone } from '@l2beat/config'
import { ProjectCostsChart } from '~/components/chart/costs/project-costs-chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { TrackedTransactionsByType } from '~/utils/project/costs/get-tracked-transactions'

import { ProjectSection } from '../project-section'
import type { ProjectSectionProps } from '../types'
import { TrackedTransactions } from './tracked-transactions'

export interface CostsSectionProps extends ProjectSectionProps {
  projectId: string
  milestones: Milestone[]
  trackedTransactions: TrackedTransactionsByType
}

export function CostsSection({
  projectId,
  milestones,
  trackedTransactions,
  ...sectionProps
}: CostsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-base">
        The section shows the operating costs that L2s pay to Ethereum.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectCostsChart milestones={milestones} projectId={projectId} />
      <HorizontalSeparator className="my-4" />
      <TrackedTransactions {...trackedTransactions} />
    </ProjectSection>
  )
}
