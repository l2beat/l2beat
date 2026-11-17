import type { Milestone } from '@l2beat/config'
import { ProjectCostsChart } from '~/components/chart/costs/ProjectCostsChart'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TrackedTxsOutageNotice } from '~/components/TrackedTxsOutageNotice'
import { env } from '~/env'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import { COSTS_DESCRIPTION } from '../sectionCopy'
import type { ProjectSectionProps } from '../types'
import { TrackedTransactions } from './TrackedTransactions'

export interface CostsSectionProps extends ProjectSectionProps {
  project: ChartProject
  milestones: Milestone[]
  trackedTransactions: TrackedTransactionsByType
  defaultRange: ChartRange
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
      {env.CLIENT_SIDE_TRACKED_TXS_OUTAGE && (
        <TrackedTxsOutageNotice type="section" className="mt-0 mb-4" />
      )}
      {/* Opens on the chart's own finding, like Activity beside it; what the
        section measures follows the numbers. */}
      <ProjectCostsChart
        milestones={milestones}
        project={project}
        defaultRange={defaultRange}
      />
      <p className="mt-4 text-paragraph-15 md:text-paragraph-16">
        {COSTS_DESCRIPTION}
      </p>
      <HorizontalSeparator className="my-4" />
      <TrackedTransactions {...trackedTransactions} />
    </ProjectSection>
  )
}
