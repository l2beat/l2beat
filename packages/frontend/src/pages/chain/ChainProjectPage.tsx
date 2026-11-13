import { ProjectInteropMetrics } from '~/components/projects/ProjectInteropMetrics'
import type { ChainProjectPageEntry } from '~/server/features/chains/getChainProjectEntry'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../project/ProjectPage'

interface Props extends ProjectPageCommonProps {
  entry: ChainProjectPageEntry
}

export function ChainProjectPage({ entry, ...props }: Props) {
  return (
    <ProjectPage
      {...props}
      project={{ ...entry, isUnderReview: false }}
      summary={
        <section
          id="summary"
          data-role="nav-section"
          className="w-full scroll-mt-[100vh] border-divider bg-surface-primary px-4 max-md:border-b max-md:pb-4 md:rounded-lg md:p-6"
        >
          <ProjectInteropMetrics interop={entry.interop} />
        </section>
      }
      sections={entry.sections}
    />
  )
}
