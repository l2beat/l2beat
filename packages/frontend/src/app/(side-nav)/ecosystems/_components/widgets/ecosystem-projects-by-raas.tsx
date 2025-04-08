import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
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
      <EcosystemWidgetTitle>Rollup as a Service</EcosystemWidgetTitle>
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
            <div className="flex -space-x-1.5">
              {projects.map((project) => (
                <Tooltip key={project.slug}>
                  <TooltipTrigger asChild>
                    <Link href={project.href} className="shrink-0">
                      <Image
                        src={`/icons/${project.slug}.png`}
                        alt={project.slug}
                        width={20}
                        height={20}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <h3 className="font-bold">{project.name}</h3>
                    <p className="text-xs text-secondary">
                      Click to view project page
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </EcosystemWidget>
  )
}
