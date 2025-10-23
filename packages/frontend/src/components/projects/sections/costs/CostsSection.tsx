import type { Milestone } from '@l2beat/config'
import { ProjectCostsChart } from '~/components/chart/costs/ProjectCostsChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { TrackedTransactions } from './TrackedTransactions'

export interface CostsSectionProps extends ProjectSectionProps {
  project: ChartProject
  milestones: Milestone[]
  trackedTransactions: TrackedTransactionsByType
  defaultRange: CostsTimeRange
}

export function CostsSection({
  project,
  milestones,
  trackedTransactions,
  defaultRange,
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
        project={project}
        defaultRange={defaultRange}
      />
      <HorizontalSeparator className="my-4" />
      <TrackedTransactions {...trackedTransactions} />
    </ProjectSection>
  )
}
