'use client'

import { assert } from '@l2beat/shared-pure'
import { useState } from 'react'
import Image from '~/_next/image'
import type { UsedInProjectWithIcon } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'
import { ArrowIcon } from '~/icons/arrow'
import type { ProjectByRaas } from '~/server/features/ecosystems/get-projects-by-raas'
import { cn } from '~/utils/cn'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

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
          <Image
            src={icon}
            className="rounded-sm"
            alt={raas}
            width={32}
            height={32}
          />
          <span className="label-value-18-bold">{raas}</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowIcon
            className="size-3 -rotate-90 cursor-pointer fill-brand"
            onClick={() =>
              setSelectedRaas(
                selectedRaas === 0
                  ? Object.keys(projectsByRaas).length - 1
                  : selectedRaas - 1,
              )
            }
          />
          <span className="subtitle-10 text-secondary">{`${selectedRaas + 1} OF ${Object.keys(projectsByRaas).length}`}</span>
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
      <div className="subtitle-12 mb-2 mt-4 uppercase text-secondary">
        Used by
      </div>
      {projects.length <= 4 ? (
        <div className="grid w-full grid-cols-2">
          {projects.map((p) => (
            <ProjectLinkWithTooltip key={p.slug} project={p}>
              <div className="flex items-center gap-2">
                <Image
                  src={p.icon}
                  className="rounded-sm"
                  alt={p.name}
                  width={18}
                  height={18}
                />
                <div className="whitespace-nowrap text-xs font-bold">
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
              <Image
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
}: { project: UsedInProjectWithIcon; children: React.ReactNode }) {
  return (
    <Tooltip>
      <LinkWithOnHoverPrefetch
        href={`/scaling/projects/${project.slug}`}
        className="size-6"
      >
        <TooltipTrigger>{children}</TooltipTrigger>
      </LinkWithOnHoverPrefetch>
      <TooltipPortal>
        <TooltipContent>
          <p className="font-bold">{project.name}</p>
          <p className="text-xs text-secondary">Click to view project page</p>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
