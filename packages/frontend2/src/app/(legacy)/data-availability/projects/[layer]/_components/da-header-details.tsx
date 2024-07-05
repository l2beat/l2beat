import { type ReactNode } from 'react'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/format'
import InfoIcon from '~/icons/info.svg'
import { EM_DASH } from '~/app/_components/nav/consts'
import { type DaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'

interface Props {
  project: DaProjectEntry
}

export function DaHeaderDetails({ project }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-100 dark:bg-zinc-900 rounded-lg md:px-6 md:py-5">
      <DetailsHeaderStat title="Type" value={project.type} />
      <DetailsHeaderStat
        title="Total value secured"
        value={formatCurrency(project.tvs, 'usd', {
          showLessThanMinimum: false,
        })}
      />
      <DetailsHeaderStat
        title="Economic security"
        value={
          project.economicSecurity?.status === 'Synced'
            ? formatCurrency(project.economicSecurity.economicSecurity, 'usd', {
                showLessThanMinimum: false,
              })
            : 'Not synced'
        }
      />
      <HorizontalSeparator className="col-span-full my-5 max-md:hidden" />
      <DetailsHeaderStat
        title="Duration of storage"
        value={`${project.durationStorage}s` ?? EM_DASH}
      />
      <DetailsHeaderStat
        className="md:col-span-2"
        title="Used in"
        value={
          project.usedIn.length !== 0 ? (
            <Tooltip>
              <TooltipTrigger>
                <div className="truncate max-w-[250px] md:max-w-[440px]">
                  {project.usedIn.map((project) => project.name).join(', ')}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {project.usedIn.map((project) => project.name).join(', ')}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            'None'
          )
        }
      />
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
