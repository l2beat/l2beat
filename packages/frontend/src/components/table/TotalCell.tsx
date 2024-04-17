import React from 'react'

import { ScalingL2SummaryViewEntry } from '../../pages/scaling/summary/types'
import { Badge } from '../badge/Badge'
import { RoundedWarningIcon } from '../icons'
import { Callout } from '../project/Callout'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NumberCell } from './NumberCell'

export interface TotalCellProps {
  project: ScalingL2SummaryViewEntry
}

export function TotalCell({ project }: TotalCellProps) {
  const content = project.tvl ? (
    <>
      <NumberCell
        className="font-bold"
        tooltip={project.tvlWarnings ? undefined : project.tvlTooltip}
      >
        {project.tvl?.displayValue}
      </NumberCell>
      <NumberCell signed className="ml-1 w-[72px] !text-base font-medium">
        {project.sevenDayChange}
      </NumberCell>
    </>
  ) : (
    <Badge type="gray" className="mx-auto translate-x-[11.5px]">
      Coming soon
    </Badge>
  )

  if (project.tvlWarnings?.length && project.tvl) {
    const anyBadWarnings = project.tvlWarnings.some(
      (w) => w?.sentiment === 'bad',
    )
    return (
      <Tooltip>
        <TooltipTrigger className="relative flex items-center gap-1">
          {content}
          <RoundedWarningIcon
            className="absolute -right-4 size-4"
            sentiment={anyBadWarnings ? 'bad' : 'warning'}
          />
        </TooltipTrigger>
        <TooltipContent>
          {project.tvlWarnings.map((warning, i) => (
            <Callout
              key={`tvl-warning-${i}`}
              icon={
                <RoundedWarningIcon
                  className="size-5"
                  sentiment={warning.sentiment}
                />
              }
              body={warning.content}
            />
          ))}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
