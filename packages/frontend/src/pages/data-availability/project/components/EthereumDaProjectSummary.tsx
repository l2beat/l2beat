import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { ProjectsUsedIn } from '~/pages/data-availability/summary/components/table/ProjectsUsedIn'
import type { ProjectSummaryStat } from '~/pages/scaling/project/components/ScalingProjectStats'
import type { EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { DaProjectStats, getCommonDaProjectStats } from './DaProjectStats'
import { InfoCallout } from './InfoCallout'

interface Props {
  project: EthereumDaProjectPageEntry
}

export function EthereumDaProjectSummary({ project }: Props) {
  const stats: ProjectSummaryStat[] = [
    ...getCommonDaProjectStats(project),
    {
      title: 'DA Bridge',
      value: project.header.bridgeName,
    },
    {
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
      data-role="project-section"
      className="w-full border-divider bg-surface-primary px-4 max-md:border-b md:rounded-lg md:p-6"
    >
      <div className="space-y-6">
        <DaProjectStats stats={stats} />

        <InfoCallout
          title={project.header.callout.title}
          description={project.header.callout.description}
        />

        <div className="-mx-4 !mt-0 px-4 md:hidden">
          <HorizontalSeparator className="-mx-4 w-[calc(100%+2rem)]" />
          <MobileProjectLinks projectLinks={project.header.links} />
        </div>
      </div>
    </section>
  )
}
