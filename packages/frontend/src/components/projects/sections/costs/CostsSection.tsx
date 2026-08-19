import type { Milestone } from '@l2beat/config'
import { ProjectCostsChart } from '~/components/chart/costs/ProjectCostsChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TrackedTxsOutageNotice } from '~/components/TrackedTxsOutageNotice'
import { env } from '~/env'
import { CompareProjectsLink } from '~/pages/scaling/compare/components/CompareProjectsLink'
import type { TrackedTransactionsByType } from '~/utils/project/tracked-txs/getTrackedTransactions'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { TrackedTransactions } from './TrackedTransactions'

export interface CostsSectionProps extends ProjectSectionProps {
  project: ChartProject
  milestones: Milestone[]
  trackedTransactions: TrackedTransactionsByType
  defaultRange: ChartRange
  /** Entry to the compare page with this project pre-selected. */
  compareUrl?: string
}

export function CostsSection({
  project,
  milestones,
  trackedTransactions,
  defaultRange,
  compareUrl,
  ...sectionProps
}: CostsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      headerAccessory={
        compareUrl && (
          <CompareProjectsLink
            variant="section"
            href={compareUrl}
            className="max-md:hidden"
          >
            Compare
          </CompareProjectsLink>
        )
      }
    >
      <p className="text-paragraph-15 md:text-paragraph-16">
        The section shows the operating costs that L2s pay to Ethereum.
      </p>
      {env.CLIENT_SIDE_TRACKED_TXS_OUTAGE && (
        <TrackedTxsOutageNotice type="section" className="mb-0" />
      )}
      <HorizontalSeparator className="my-4" />
      <ProjectCostsChart
        milestones={milestones}
        project={project}
        defaultRange={defaultRange}
      />
      <HorizontalSeparator className="my-4" />
      <TrackedTransactions {...trackedTransactions} />
      {compareUrl && (
        <CompareProjectsLink
          variant="section"
          href={compareUrl}
          className="mt-4 md:hidden"
        >
          Compare with other projects
        </CompareProjectsLink>
      )}
    </ProjectSection>
  )
}
