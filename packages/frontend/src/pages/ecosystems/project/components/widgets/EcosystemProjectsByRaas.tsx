import { assert } from '@l2beat/shared-pure'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { ArrowIcon } from '~/icons/Arrow'
import type { ProjectByRaas } from '~/server/features/ecosystems/getProjectsByRaas'
import { cn } from '~/utils/cn'
import { EcosystemWidget, EcosystemWidgetTitle } from './EcosystemWidget'

export function EcosystemProjectsByRaas({
  projectsByRaas,
  className,
}: {
  projectsByRaas: ProjectByRaas
  className?: string
}) {
  const [selectedRaas, setSelectedRaas] = useState(0)
  const raasEntry = Object.entries(projectsByRaas)[selectedRaas]
  assert(raasEntry, 'No RAAS selected')
  const [raas, { projects, icon }] = raasEntry

  return (
    <EcosystemWidget className={cn(className, 'select-none')}>
      <EcosystemWidgetTitle className="mb-4">
        RaaS Providers
      </EcosystemWidgetTitle>
      <div className="flex justify-between">
        <div className="flex items-center gap-1.5">
          <img
            src={icon}
            className="rounded-sm"
            alt={raas}
            width={32}
            height={32}
          />
          <span className="font-bold text-label-value-18">{raas}</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowIcon
            className="-rotate-90 size-3 cursor-pointer fill-brand"
            onClick={() =>
              setSelectedRaas(
                selectedRaas === 0
                  ? Object.keys(projectsByRaas).length - 1
                  : selectedRaas - 1,
              )
            }
          />
          <span className="text-secondary text-subtitle-10">{`${selectedRaas + 1} OF ${Object.keys(projectsByRaas).length}`}</span>
          <ArrowIcon
            className="size-3 rotate-90 cursor-pointer fill-brand"
            onClick={() =>
              setSelectedRaas(
                selectedRaas === Object.keys(projectsByRaas).length - 1
                  ? 0
                  : selectedRaas + 1,
              )
            }
          />
        </div>
      </div>
      <div className="mt-4 mb-2 text-secondary text-subtitle-12 uppercase">
        Used by
      </div>
      {projects.length <= 4 ? (
        <div className="grid w-full grid-cols-2">
          {projects.map((p) => (
            <ProjectLinkWithTooltip key={p.slug} project={p}>
              <div className="flex items-center gap-2">
                <img
                  src={p.icon}
                  className="rounded-sm"
                  alt={p.name}
                  width={18}
                  height={18}
                />
                <div className="whitespace-nowrap font-bold text-xs">
                  {p.name}
                </div>
              </div>
            </ProjectLinkWithTooltip>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <ProjectLinkWithTooltip key={project.slug} project={project}>
              <img
                width={24}
                height={24}
                src={project.icon}
                alt={`${project.name} logo`}
              />
            </ProjectLinkWithTooltip>
          ))}
        </div>
      )}
    </EcosystemWidget>
  )
}

function ProjectLinkWithTooltip({
  project,
  children,
}: {
  project: UsedInProjectWithIcon
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <a href={`/scaling/projects/${project.slug}`} className="size-6">
        <TooltipTrigger>{children}</TooltipTrigger>
      </a>
      <TooltipContent>
        <p className="font-bold">{project.name}</p>
        <p className="text-secondary text-xs">Click to view project page</p>
      </TooltipContent>
    </Tooltip>
  )
}
