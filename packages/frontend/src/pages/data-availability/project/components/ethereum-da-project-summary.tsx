import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { FullPageHeader } from '~/components/full-page-header'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { ProjectsUsedIn } from '~/pages/data-availability/summary/components/table/projects-used-in'
import type { EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import type { ProjectStat } from './da-project-stats'
import { DaProjectStats, getCommonDaProjectStats } from './da-project-stats'
import { InfoCallout } from './info-callout'

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
      <section id="summary" className="w-full">
        <ProjectHeader project={project} />
        <div className="mt-6 flex w-full flex-col gap-4">
          <div className="flex flex-row items-start gap-10">
            <div className="w-full">
              <div className="!mb-8 hidden md:flex">
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
