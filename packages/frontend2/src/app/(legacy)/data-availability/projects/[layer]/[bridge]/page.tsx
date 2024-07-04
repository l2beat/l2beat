import { daLayers } from '@l2beat/config'
import { notFound } from 'next/navigation'
import { mapRisksToRosetteValues } from '~/app/(new)/data-availability/_utils/map-risks-to-rosette-values'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { ProjectHeader } from '~/app/_components/projects/project-header'
import { BigRosette } from '~/app/_components/rosette/big-rosette/big-rosette'
import { getDaRisks } from '~/server/features/data-availability/utils/get-da-risks'
import { DaBridgeSelect } from '../_components/da-bridge-select'
import { getDaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
import { cn } from '~/utils/cn'
import { type ReactNode } from 'react'
import InfoIcon from '~/icons/info.svg'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { formatCurrency } from '~/utils/format'
import { EM_DASH } from '~/app/_components/nav/consts'

interface Props {
  params: {
    layer: string
    bridge: string
  }
}

const projects = [...daLayers]

export async function generateStaticParams() {
  return projects.map((layer) =>
    layer.bridges.map((bridge) => ({
      layer: layer.id,
      bridge: bridge.id,
    })),
  )
}

export default async function Page(props: Props) {
  const project = projects.find((p) => p.display.slug === props.params.layer)
  if (!project) return notFound()
  const bridge = project.bridges.find((b) => b.id === props.params.bridge)
  if (!bridge) return notFound()
  const daProjectEntry = await getDaProjectEntry(project, bridge)

  return (
    <div>
      <header className="flex gap-10">
        <div className="w-full">
          <ProjectHeader
            title={project.display.name}
            src={`/icons/${project.display.slug}.png`}
          />
          <DaBridgeSelect layer={project} label={bridge.display.name} />
          <HorizontalSeparator className="my-6" />
          <div className="grid grid-cols-3 bg-gray-100 dark:bg-zinc-900 rounded-lg px-6 py-5">
            <DetailsHeaderStat title="Type" value={daProjectEntry.type} />

            <DetailsHeaderStat
              title="Total value secured"
              value={formatCurrency(daProjectEntry.tvs, 'usd', {
                showLessThanMinimum: false,
              })}
            />
            <DetailsHeaderStat
              title="Economic security"
              value={
                daProjectEntry.economicSecurity?.status === 'Synced'
                  ? formatCurrency(
                      daProjectEntry.economicSecurity.economicSecurity,
                      'usd',
                      { showLessThanMinimum: false },
                    )
                  : 'Not synced'
              }
            />
            <HorizontalSeparator className="col-span-full my-5" />
            <DetailsHeaderStat
              title="Duration of storage"
              value={`${daProjectEntry.durationStorage}s` ?? EM_DASH}
            />
            <DetailsHeaderStat
              title="Used in"
              value={
                daProjectEntry.usedIn.length !== 0 ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="truncate max-w-[220px]">
                        {daProjectEntry.usedIn
                          .map((project) => project.name)
                          .join(', ')}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        {daProjectEntry.usedIn
                          .map((project) => project.name)
                          .join(', ')}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  'None'
                )
              }
            />
          </div>
        </div>
        <BigRosette
          className="max-lg:hidden mt-auto"
          values={mapRisksToRosetteValues(getDaRisks(project, bridge))}
        />
      </header>
    </div>
  )
}

export interface ProjectSummaryStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}
function DetailsHeaderStat(props: ProjectSummaryStat) {
  return (
    <li
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <span className="text-gray-500 text-xs dark:text-gray-600">
          {props.title}
        </span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="-translate-y-px md:translate-y-0">
              <InfoIcon className="mt-[2px] fill-gray-500 md:size-3.5 dark:fill-gray-600" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="!leading-none font-semibold text-lg md:font-bold md:text-xl">
        {props.value}
      </span>
    </li>
  )
}
