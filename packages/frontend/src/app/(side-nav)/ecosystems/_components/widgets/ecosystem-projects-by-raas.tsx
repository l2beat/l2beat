'use client'

import type { ProjectByRaas } from '~/server/features/ecosystems/get-projects-by-raas'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'
import { useState } from 'react'
import { assert } from '@l2beat/shared-pure'
import Image from '~/_next/image'
import { ArrowIcon } from '~/icons/arrow'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'
import { chunk } from 'lodash'
import type { UsedInProjectWithIcon } from '~/app/(side-nav)/data-availability/summary/_components/table/projects-used-in'

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
    <EcosystemWidget className={className}>
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
        <table className="w-full">
          <tbody>
            {chunk(projects, 2).map((row, index) => (
              <tr key={index}>
                {row.map((project) => (
                  <td key={project.slug} className="w-1/2 pb-1.5 ">
                    <ProjectLinkWithTooltip project={project}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={project.icon}
                          className="rounded-sm"
                          alt={project.name}
                          width={18}
                          height={18}
                        />
                        <div className="whitespace-nowrap text-xs font-bold">
                          {project.name}
                        </div>
                      </div>
                    </ProjectLinkWithTooltip>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
