import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'

export interface ProjectSummaryStat {
  title: string
  shortTitle?: string
  value: ReactNode
  tooltip?: string
  className?: string
  valueClassName?: string
}

export function ProjectSummaryStat(props: ProjectSummaryStat) {
  return (
    <li
      key={props.title}
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <span
          className={cn(
            'paragraph-12-medium text-nowrap text-secondary',
            props.shortTitle && 'max-md:hidden',
          )}
        >
          {props.title}
        </span>
        {props.shortTitle && (
          <span className="paragraph-12-medium text-secondary md:hidden">
            {props.shortTitle}
          </span>
        )}
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="size-3">
              <InfoIcon className="size-3" variant="gray" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className={cn('label-value-16-bold', props.valueClassName)}>
        {props.value}
      </span>
    </li>
  )
}
