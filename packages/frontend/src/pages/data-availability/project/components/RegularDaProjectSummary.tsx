import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RiskBanner } from '~/components/projects/RiskBanner'
import { ProjectsUsedIn } from '~/pages/data-availability/summary/components/table/ProjectsUsedIn'
import type { ProjectSummaryStat } from '~/pages/scaling/project/components/ScalingProjectStats'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { DaProjectStats, getCommonDaProjectStats } from './DaProjectStats'
import { MultipleBridgeDetails } from './MultipleBridgeDetails'
import { SingleBridgeDetails } from './SingleBridgeDetails'

interface Props {
  project: DaProjectPageEntry
}

export function RegularDaProjectSummary({ project }: Props) {
  const hasMultipleBridges = project.bridges.length > 1
  const stats: ProjectSummaryStat[] = [
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
    <section
      id="summary"
      data-role="project-section"
      className="w-full space-y-4 border-divider bg-surface-primary px-4 pb-6 max-md:border-b md:rounded-lg md:p-6"
    >
      <DaProjectStats stats={stats} />
      {hasMultipleBridges && (
        <div className="space-y-2">
          <div className="whitespace-pre text-secondary text-xs">
            {project.name} risks
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {project.header.daLayerGrissiniValues.map((value) => (
              <RiskBanner
                key={value.name}
                {...value}
                descriptionAsTooltip={true}
                info="compact"
              />
            ))}
          </div>
        </div>
      )}
      <HorizontalSeparator className="my-5" />

      {hasMultipleBridges ? (
        <MultipleBridgeDetails project={project} />
      ) : (
        <SingleBridgeDetails project={project} />
      )}
      {/* Details row
      <div className="mt-6 flex w-full flex-col gap-6 md:gap-8">
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
      </div> */}
    </section>
  )
}
