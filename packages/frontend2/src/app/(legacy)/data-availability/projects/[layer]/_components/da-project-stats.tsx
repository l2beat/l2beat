import { UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { type ReactNode } from 'react'
import { ProjectsUsedIn } from '~/app/(new)/data-availability/summary/_components/table/projects-used-in'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { EM_DASH } from '~/consts/characters'
import InfoIcon from '~/icons/info.svg'
import { type DaProjectEntry } from '~/server/features/data-availability/project/get-da-project-entry'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/format'

interface Props {
  project: DaProjectEntry
}

export function DaProjectStats({ project }: Props) {
  const durationStorage =
    project.kind === 'DAC'
      ? {
          value: 'Flexible',
          tooltip:
            'The duration depends on the offchain configuration of the DAC.',
        }
      : {
          value: project.header.durationStorage
            ? round(project.header.durationStorage / UnixTime.DAY, 2)
            : EM_DASH,
        }

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg bg-gray-100 dark:bg-zinc-900 md:grid-cols-3 md:px-6 md:py-5">
      <ProjectStat title="Type" value={project.type} />
      <ProjectStat
        title="Total value secured"
        value={formatCurrency(project.header.tvs, 'usd', {
          showLessThanMinimum: false,
        })}
      />
      <ProjectStat
        title="Economic security"
        value={
          // EC not set
          project.header.economicSecurity
            ? // EC set but not synced
              project.header.economicSecurity.status === 'Synced'
              ? formatCurrency(
                  project.header.economicSecurity.economicSecurity,
                  'usd',
                  {
                    showLessThanMinimum: false,
                  },
                )
              : 'Not synced'
            : EM_DASH
        }
      />
      <HorizontalSeparator className="col-span-full my-5 max-md:hidden" />
      <ProjectStat title="Duration of storage" {...durationStorage} />
      <ProjectStat
        className="md:col-span-2"
        title="Used in"
        value={
          project.header.usedIn.length !== 0 ? (
            <ProjectsUsedIn
              usedIn={project.header.usedIn}
              className="flex-wrap"
            />
          ) : (
            'None'
          )
        }
      />
    </div>
  )
}

export interface ProjectStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}

function ProjectStat(props: ProjectStat) {
  return (
    <li
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row items-center gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-600">
          {props.title}
        </span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="fill-gray-500 dark:fill-gray-600 md:size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="text-lg font-semibold !leading-none md:text-xl md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
