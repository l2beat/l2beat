import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import type { ProjectSummaryStatProps } from '~/components/projects/ProjectSummaryStat'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { getEthereumProjectStats } from '../utils/getEthereumProjectStats'
import { DaProjectStats } from './DaProjectStats'

interface Props {
  project: EthereumProjectPageEntry
}

export function EthereumProjectSummary({ project }: Props) {
  const stats: (ProjectSummaryStatProps & { key: string })[] = [
    ...getEthereumProjectStats(project),
    {
      key: 'da-bridge',
      title: 'DA bridge',
      value: project.header.bridgeName,
      tooltip: project.header.bridgeTooltip,
    },
    {
      key: 'used-by',
      title: 'Used by',
      value: (
        <ProjectsUsedIn
          usedIn={project.header.usedIn}
          className="max-md:-my-1 flex-wrap justify-start"
        />
      ),
    },
  ]

  return (
    <section
      id="summary"
      data-role="nav-section"
      className="w-full scroll-mt-[100vh] border-divider bg-surface-primary px-4 max-md:border-b md:rounded-lg md:p-6"
    >
      <DaProjectStats stats={stats} className="max-md:mb-6" />

      <div className="-mx-4 !mt-0 px-4 md:hidden">
        <HorizontalSeparator className="-mx-4 w-[calc(100%+2rem)]" />
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
    </section>
  )
}
