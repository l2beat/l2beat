import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { FullPageHeader } from '~/components/FullPageHeader'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { ArchivedBar } from '~/components/projects/ArchivedBar'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DiscoUiLink } from '~/components/projects/links/DiscoUiLink'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { GrissiniDetails } from '~/components/rosette/grissini/GrissiniDetails'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import type { ProjectStat } from './DaProjectStats'
import { DaProjectStats, getCommonDaProjectStats } from './DaProjectStats'
import { MultipleBridgeDetails } from './MultipleBridgeDetails'
import { SingleBridgeDetails } from './SingleBridgeDetails'

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
    <FullPageHeader className="pt-8 pb-4 md:pt-12 md:pb-8">
      <section id="summary" data-role="project-section" className="w-full">
        <ProjectHeader project={project} />
        {/* Details row */}
        <div className="mt-6 flex w-full flex-col gap-6 md:gap-8">
          {/* Links and stats */}
          <div className="flex flex-row items-end gap-10">
            <div className="w-full">
              <div className="mb-8! hidden md:flex">
                <HorizontalSeparator className="max-md:-mx-4 max-md:w-screen" />
              </div>
              {project.archivedAt && (
                <div className="-mt-4 mb-4">
                  <ArchivedBar />
                </div>
              )}
              <div className="flex-1">
                <div className="flex flex-col gap-4">
                  <div className="max-md:hidden">
                    <DesktopProjectLinks
                      projectLinks={project.header.links}
                      variant="header"
                      discoUiHref={project.discoUiHref}
                    />
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
                  <div className="whitespace-pre text-secondary text-xs">
                    {project.name} risks
                  </div>
                  <GrissiniDetails
                    values={project.header.daLayerGrissiniValues}
                    descriptionAsTooltip
                    info="compact"
                  />
                </div>
              </div>
            )}
          </div>

          {project.discoUiHref && (
            <div className="-mb-4 md:hidden">
              <HorizontalSeparator className="max-md:-mx-4 mt-4 mb-2 max-md:w-screen md:hidden" />
              <div className="flex items-center justify-between">
                <a
                  className="text-link text-xs underline"
                  href={project.discoUiHref}
                >
                  Explore more in Discovery UI
                </a>
                <DiscoUiLink href={project.discoUiHref} />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <div>
              <div className="-mx-4 border-divider border-y px-4 md:hidden">
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
