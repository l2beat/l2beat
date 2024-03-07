import React from 'react'

import { ScalingL2SummaryViewEntry } from '../../pages/scaling/summary/types'
import { getSentimentFillColor } from '../../utils/sentimentFillColor'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NumberCell } from './NumberCell'

export interface TotalCellProps {
  project: ScalingL2SummaryViewEntry
}

export function TotalCell({ project }: TotalCellProps) {
  const content = (
    <>
      <NumberCell className="font-bold" tooltip={project.tvlTooltip}>
        {project.tvl?.displayValue}
      </NumberCell>
      <NumberCell signed className="ml-1 w-[72px] !text-base font-medium">
        {project.sevenDayChange}
      </NumberCell>
    </>
  )

  if (project.tvlWarning) {
    return (
      <Tooltip>
        <TooltipTrigger className="relative flex items-center gap-1">
          {content}
          <RoundedWarningIcon
            className={`absolute -right-4 size-4 ${getSentimentFillColor(project.tvlWarning.sentiment)}`}
          />
        </TooltipTrigger>
        <TooltipContent>{project.tvlWarning.content}</TooltipContent>
      </Tooltip>
    )
  }

  return content
}
