import { ProjectsUsedIn } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'
import type { ProjectsByDaLayer } from '~/server/features/ecosystems/get-projects-by-da-layer'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemProjectsByDaLayer({
  projectsByDaLayer,
  className,
}: {
  projectsByDaLayer: ProjectsByDaLayer
  className?: string
}) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>DA Layers used</EcosystemWidgetTitle>
      <div className="flex flex-col gap-2">
        {Object.entries(projectsByDaLayer).map(([name, projects]) => (
          <div key={name} className="flex justify-between gap-2">
            <div className="whitespace-nowrap text-xs font-bold">{name}</div>
            <ProjectsUsedIn usedIn={projects} />
          </div>
        ))}
      </div>
    </EcosystemWidget>
  )
}
