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
      <table className="w-full">
        {Object.entries(projectsByDaLayer).map(([daLayer, projects]) => (
          <tr key={daLayer}>
            <td className="w-full whitespace-nowrap pb-1.5 pr-4 text-xs font-bold">
              {daLayer}
            </td>
            <td className="whitespace-pre">
              <ProjectsUsedIn usedIn={projects} maxProjects={4} />
            </td>
          </tr>
        ))}
      </table>
    </EcosystemWidget>
  )
}
