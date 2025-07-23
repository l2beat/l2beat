import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import type { ProjectSummaryStatProps } from '~/components/projects/ProjectSummaryStat'
import { RiskBanner } from '~/components/projects/RiskBanner'
import type { DaProjectPageEntry } from '~/server/features/data-availability/project/getDaProjectEntry'
import { DaProjectStats, getCommonDaProjectStats } from './DaProjectStats'
import { MultipleBridgeDetails } from './MultipleBridgeDetails'
import { SingleBridgeDetails } from './SingleBridgeDetails'

interface Props {
  project: DaProjectPageEntry
}

export function RegularDaProjectSummary({ project }: Props) {
  const hasMultipleBridges = project.bridges.length > 1
  const stats: (ProjectSummaryStatProps & { key: string })[] = [
    ...getCommonDaProjectStats(project),
    {
      key: 'used-by',
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
    </section>
  )
}
