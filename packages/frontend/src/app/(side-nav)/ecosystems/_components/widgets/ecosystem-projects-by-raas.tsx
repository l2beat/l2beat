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
      <div className="flex flex-col gap-2">
        {Object.entries(projectsByRaas).map(([raas, projects]) => (
          <div key={raas} className="flex justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Image
                src={`/icons/${raas.toLowerCase()}.png`}
                className="rounded-sm"
                alt={raas}
                width={20}
                height={20}
              />
              <div className="whitespace-nowrap text-xs font-bold">{raas}</div>
            </div>
            <ProjectsUsedIn usedIn={projects} />
          </div>
        ))}
      </div>
    </EcosystemWidget>
  )
}
