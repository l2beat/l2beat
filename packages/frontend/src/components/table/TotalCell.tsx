import React from 'react'

import { ScalingL2SummaryViewEntry } from '../../pages/scaling/summary/types'
import { getSentimentColor } from '../../utils/sentimentColor'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NumberCell } from './NumberCell'

export interface TotalCellProps {
  project: ScalingL2SummaryViewEntry
}

export function TotalCell({ project }: TotalCellProps) {
  return project.tvlWarning !== undefined ? (
    <Tooltip>
      <TooltipTrigger className="relative flex items-center gap-1">
        <NumberCell className="font-bold">
          {project.tvl?.displayValue}
        </NumberCell>
        <NumberCell signed className="w-[72px] !text-base  font-medium">
          {project.sevenDayChange}
        </NumberCell>

        <RoundedWarningIcon
          className={`absolute -right-4 size-4 ${getSentimentColor(project.tvlWarning.sentiment)}`}
        />
      </TooltipTrigger>
      <TooltipContent>{project.tvlWarning.content}</TooltipContent>
    </Tooltip>
  ) : (
    <>
      <NumberCell className="font-bold" tooltip={project.tvlTooltip}>
        {project.tvl?.displayValue}
      </NumberCell>
      <NumberCell signed className="ml-1 w-[72px] !text-base font-medium">
        {project.sevenDayChange}
      </NumberCell>
    </>
  )
}
