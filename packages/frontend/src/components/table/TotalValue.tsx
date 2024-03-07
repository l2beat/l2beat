import React from 'react'

import { ScalingTvlViewEntry } from '../../pages/scaling/tvl/types'
import { getSentimentColor } from '../../utils/sentimentColor'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { ValueWithPercentageCell } from './ValueWithPercentageCell'

export interface TotalValueProps {
  project: ScalingTvlViewEntry
}

export function TotalValue({ project }: TotalValueProps) {
  return project.tvlWarning !== undefined ? (
    <Tooltip>
      <TooltipTrigger className="relative flex items-center gap-1">
        <ValueWithPercentageCell
          value={project.tvl?.displayValue}
          percentChange={project.tvlChange}
        />
        <RoundedWarningIcon
          className={`absolute -right-5 size-5 pl-1 ${getSentimentColor(project.tvlWarning.sentiment)}`}
        />
      </TooltipTrigger>
      <TooltipContent>{project.tvlWarning.content}</TooltipContent>
    </Tooltip>
  ) : (
    <ValueWithPercentageCell
      value={project.tvl?.displayValue}
      percentChange={project.tvlChange}
    />
  )
}
