import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { FullPageHeader } from '~/components/FullPageHeader'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectsUsedIn } from '~/pages/data-availability/summary/components/table/ProjectsUsedIn'
import type { EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import type { ProjectStat } from './DaProjectStats'
import { DaProjectStats, getCommonDaProjectStats } from './DaProjectStats'
import { InfoCallout } from './InfoCallout'

interface Props {
  project: EthereumDaProjectPageEntry
}

export function EthereumDaProjectSummary({ project }: Props) {
  const stats: ProjectStat[] = [
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
    <FullPageHeader className="pt-8 pb-0 md:pt-12 md:pb-8">
      <section id="summary" data-role="project-section" className="w-full">
        <ProjectHeader project={project} />
        <div className="mt-6 flex w-full flex-col gap-4">
          <div className="flex flex-row items-start gap-10">
            <div className="w-full">
              <div className="mb-8! hidden md:flex">
                <HorizontalSeparator className="max-md:-mx-4 max-md:w-screen" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-4">
                  <div className="max-md:hidden">
                    <DesktopProjectLinks
                      projectLinks={project.header.links}
                      variant="header"
                    />
                  </div>
                  <DaProjectStats
                    stats={stats}
                    daLayerGrissiniValues={undefined}
                  />
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-full w-[264px]">
                <InfoCallout
                  title={project.header.callout.title}
                  description={project.header.callout.description}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:hidden">
            <div>
              <div className="-mx-4 border-divider border-y px-4 md:hidden">
                <MobileProjectLinks projectLinks={project.header.links} />
              </div>
            </div>
            <div>
              <InfoCallout
                title={project.header.callout.title}
                description={project.header.callout.description}
              />
            </div>
          </div>
        </div>
      </section>
    </FullPageHeader>
  )
}
