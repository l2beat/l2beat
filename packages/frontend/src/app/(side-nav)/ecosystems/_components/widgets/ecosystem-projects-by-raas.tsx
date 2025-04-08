import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemProjectsByRaas({
  projectsByRaas,
  className,
}: {
  projectsByRaas: Record<string, { slug: string; name: string; href: string }[]>
  className?: string
}) {
  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle>Rollup as a Service</EcosystemWidgetTitle>
      <div className="flex flex-col gap-2">
        {Object.entries(projectsByRaas).map(([raas, projects]) => (
          <div key={raas} className="flex justify-between gap-2">
            <div className="whitespace-nowrap text-xs font-bold">{raas}</div>
            <div className="flex -space-x-1.5">
              {projects.map((project) => (
                <Tooltip key={project.slug}>
                  <TooltipTrigger asChild>
                    <Link href={project.href}>
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
