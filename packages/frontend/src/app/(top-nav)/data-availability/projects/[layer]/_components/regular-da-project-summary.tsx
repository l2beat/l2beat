import { ProjectsUsedIn } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { FullPageHeader } from '~/components/full-page-header'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import { MobileProjectLinks } from '~/components/projects/links/mobile-project-links'
import { ProjectHeader } from '~/components/projects/project-header'
import { GrissiniDetails } from '~/components/rosette/grissini/grissini-details'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import type { ProjectStat } from './da-project-stats'
import { DaProjectStats, getCommonDaProjectStats } from './da-project-stats'
import { MultipleBridgeDetails } from './multiple-bridge-details'
import { SingleBridgeDetails } from './single-bridge-details'

interface Props {
  project: DaProjectPageEntry
}

export function RegularDaProjectSummary({ project }: Props) {
  const hasMultipleBridges = project.bridges.length > 1
  const stats: ProjectStat[] = [
    ...getCommonDaProjectStats(project),
    {
      title: 'Used by',
      value: (
        <ProjectsUsedIn
          usedIn={project.header.usedIn}
          className="flex-wrap justify-start"
          maxProjects={5}
        />
      ),
    },
  ]

  return (
    <FullPageHeader className="pb-4 pt-8 md:pb-8 md:pt-12">
      <section id="summary" className="w-full">
        <ProjectHeader title={project.name} slug={project.slug} />
        {/* Details row */}
        <div className="mt-6 flex w-full flex-col gap-6 md:gap-8">
          {/* Links and stats */}
          <div className="flex flex-row items-end gap-10">
            <div className="w-full">
              <div className="!mb-8 hidden md:flex">
                <HorizontalSeparator className="max-md:-mx-4 max-md:w-screen" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-4">
                  <div className="max-md:hidden">
                    <DesktopProjectLinks projectLinks={project.header.links} />
                  </div>
                  <DaProjectStats
                    stats={stats}
                    daLayerGrissiniValues={project.header.daLayerGrissiniValues}
                  />
                </div>
              </div>
            </div>
            {/* Right side (DA Layer Grissini details) */}
            {hasMultipleBridges && (
              <div className="hidden lg:block">
                <div className="flex flex-col gap-4 pt-3">
                  <div className="whitespace-pre text-xs text-secondary">
                    {project.name} risks
                  </div>
                  <GrissiniDetails
                    values={project.header.daLayerGrissiniValues}
                    showTooltip
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div>
              <div className="-mx-4 border-y border-divider px-4 md:hidden">
                <MobileProjectLinks projectLinks={project.header.links} />
              </div>
            </div>
            {hasMultipleBridges ? (
              <MultipleBridgeDetails project={project} />
            ) : (
              <SingleBridgeDetails project={project} />
            )}
          </div>
        </div>
      </section>
    </FullPageHeader>
  )
}
