import { ProjectsUsedIn } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { type EthereumDaProjectPageEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import {
  DaProjectStats,
  type ProjectStat,
  getCommonDaProjectStats,
} from './da-project-stats'
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
    <section
      id="summary"
      className="border-divider max-md:border-b max-md:bg-surface-header max-md:px-4"
    >
      <header className="space-y-4 pt-6 max-md:pb-4 md:space-y-3">
        <ProjectHeader title={project.name} slug={project.slug} />
      </header>
      <div className="flex w-full gap-10">
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-end gap-10">
              <div className="w-full">
                <div className="!mb-8 !mt-4 hidden md:flex">
                  <HorizontalSeparator className="max-md:-mx-4 max-md:w-screen" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-4">
                    <div className="max-md:hidden">
                      <DesktopProjectLinks
                        projectLinks={project.header.links}
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

            <div className="flex flex-col">
              <div>
                <div className="-mx-4 border-y border-divider px-4 md:hidden">
                  <MobileProjectLinks projectLinks={project.header.links} />
                </div>
              </div>
              <div className="lg:hidden">
                <InfoCallout
                  title={project.header.callout.title}
                  description={project.header.callout.description}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-md:hidden">
        <HorizontalSeparator />
      </div>
    </section>
  )
}
