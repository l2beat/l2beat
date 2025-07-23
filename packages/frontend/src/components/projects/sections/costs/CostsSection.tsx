import type { Milestone } from '@l2beat/config'
import { ProjectCostsChart } from '~/components/chart/costs/ProjectCostsChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { TrackedTransactions } from './TrackedTransactions'

export interface CostsSectionProps extends ProjectSectionProps {
  projectId: string
  milestones: Milestone[]
  trackedTransactions: TrackedTransactionsByType
  defaultRange: CostsTimeRange
  hasPostedData: boolean
}

export function CostsSection({
  projectId,
  milestones,
  trackedTransactions,
  defaultRange,
  hasPostedData,
  ...sectionProps
}: CostsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        The section shows the operating costs that L2s pay to Ethereum.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectCostsChart
        milestones={milestones}
        projectId={projectId}
        defaultRange={defaultRange}
        hasPostedData={hasPostedData}
      />
      <HorizontalSeparator className="my-4" />
      <TrackedTransactions {...trackedTransactions} />
    </ProjectSection>
  )
}
