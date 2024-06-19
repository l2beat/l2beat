import React from 'react'

import { ArrowRightIcon, RoundedWarningIcon } from '../../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/Tooltip'

interface BridgedUsingCellProps {
  bridge?: {
    name: string
    slug?: string
    warning?: string
  }
}

export function BridgedUsingCell(props: BridgedUsingCellProps) {
  return (
    <div className="flex items-center gap-1">
      {props.bridge?.slug ? (
        <a
          className="flex items-center justify-start gap-1"
          href={`/bridges/projects/${props.bridge?.slug}`}
        >
          <span className="font-medium text-blue-700 text-xs underline dark:text-blue-500">
            {props.bridge?.name}
          </span>
          <ArrowRightIcon className="inline-block fill-blue-700 transition-transform dark:fill-blue-500" />
        </a>
      ) : props.bridge ? (
        <span className="font-medium text-xs">{props.bridge?.name}</span>
      ) : null}
      {props.bridge?.warning && (
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon className="size-4" sentiment="bad" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">{props.bridge.warning}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
