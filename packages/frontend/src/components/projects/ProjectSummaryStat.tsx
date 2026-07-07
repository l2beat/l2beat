import { Slot } from '@radix-ui/react-slot'
import type { ReactElement, ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'

type ProjectSummaryStatTitleProps =
  | {
      title: ReactNode
      titleAsChild?: false
    }
  | {
      title: ReactElement
      titleAsChild: true
    }

export type ProjectSummaryStatProps = ProjectSummaryStatTitleProps & {
  value: ReactNode
  tooltip?: string
  className?: string
  valueClassName?: string
}

export function ProjectSummaryStat(props: ProjectSummaryStatProps) {
  return (
    <li
      className={cn(
        'flex max-md:items-center max-md:justify-between md:flex-col md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        {props.titleAsChild ? (
          <Slot className="text-nowrap font-medium text-paragraph-12 text-secondary">
            {props.title}
          </Slot>
        ) : (
          <span className="text-nowrap font-medium text-paragraph-12 text-secondary">
            {props.title}
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

      <span
        className={cn('font-bold text-label-value-16', props.valueClassName)}
      >
        {props.value}
      </span>
    </li>
  )
}
