import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import type { ProjectSummaryStatProps } from '~/components/projects/ProjectSummaryStat'
import type { EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { DaProjectStats, getCommonDaProjectStats } from './DaProjectStats'
import { InfoCallout } from './InfoCallout'

interface Props {
  project: EthereumDaProjectPageEntry
}

export function EthereumDaProjectSummary({ project }: Props) {
  const stats: (ProjectSummaryStatProps & { key: string })[] = [
    ...getCommonDaProjectStats(project),
    {
      key: 'da-bridge',
      title: 'DA Bridge',
      value: project.header.bridgeName,
    },
    {
      key: 'used-by',
      title: 'Used by',
      value: (
        <ProjectsUsedIn
          usedIn={project.header.usedIn}
          className="flex-wrap justify-start"
          noTooltip
        />
      ),
    },
  ]

  return (
    <section
      id="summary"
      data-role="nav-section"
      className="w-full border-divider bg-surface-primary px-4 max-md:border-b md:rounded-lg md:p-6"
    >
      <DaProjectStats stats={stats} className="mb-6" />

      <InfoCallout
        title={project.header.callout.title}
        description={project.header.callout.description}
      />

      <div className="-mx-4 !mt-0 px-4 md:hidden">
        <HorizontalSeparator className="-mx-4 w-[calc(100%+2rem)]" />
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
    </section>
  )
}
