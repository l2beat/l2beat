import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { EthereumProjectSummary } from '~/pages/ethereum/components/EthereumProjectSummary'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../project/ProjectPage'

interface Props extends ProjectPageCommonProps {
  entry: EthereumProjectPageEntry
}

export function EthereumProjectPage({ entry, ...props }: Props) {
  return (
    <ProjectPage
      {...props}
      project={entry}
      intro={
        <>
          <ProjectSummaryBars
            project={{
              underReviewStatus: entry.isUnderReview ? 'config' : undefined,
              header: {},
            }}
          />
          <div className="mb-3 max-md:hidden">
            <DesktopProjectLinks projectLinks={entry.header.links} />
          </div>
        </>
      }
      summary={<EthereumProjectSummary project={entry} />}
      sections={entry.sections}
    />
  )
}
