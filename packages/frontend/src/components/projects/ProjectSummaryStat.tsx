import { Slot } from '@radix-ui/react-slot'
import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'

export interface ProjectSummaryStatProps {
  title: ReactNode
  value: ReactNode
  tooltip?: string
  className?: string
  valueClassName?: string
}

export function ProjectSummaryStat(props: ProjectSummaryStatProps) {
  const Comp = typeof props.title === 'string' ? 'span' : Slot
  return (
    <li
      className={cn(
        'flex max-md:items-center max-md:justify-between md:flex-col md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <Comp className="text-nowrap font-medium text-paragraph-12 text-secondary">
          {props.title}
        </Comp>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="size-3">
              <InfoIcon className="size-3" variant="gray" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span
        className={cn('font-bold text-label-value-16', props.valueClassName)}
      >
        {props.value}
      </span>
    </li>
  )
}
