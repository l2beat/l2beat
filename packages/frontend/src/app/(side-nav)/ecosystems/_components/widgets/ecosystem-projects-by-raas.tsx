import Image from 'next/image'
import { ProjectsUsedIn } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'
import type { ProjectByRaas } from '~/server/features/ecosystems/get-projects-by-raas'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemProjectsByRaas({
  projectsByRaas,
  className,
}: {
  projectsByRaas: ProjectByRaas
  className?: string
}) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>RaaS Providers</EcosystemWidgetTitle>
      <table className="w-full">
        {Object.entries(projectsByRaas).map(([raas, projects]) => (
          <tr key={raas}>
            <td className="w-full pb-1.5 pr-4">
              <div className="flex items-center gap-1.5">
                <Image
                  src={`/icons/${raas.toLowerCase()}.png`}
                  className="rounded-sm"
                  alt={raas}
                  width={20}
                  height={20}
                />
                <div className="whitespace-nowrap text-xs font-bold">
                  {raas}
                </div>
              </div>
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
