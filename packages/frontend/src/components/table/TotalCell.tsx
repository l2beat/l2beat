import { notUndefined } from '@l2beat/shared-pure'
import React from 'react'

import { ScalingL2SummaryViewEntry } from '../../pages/scaling/summary/types'
import { getSentimentFillColor } from '../../utils/sentimentFillColor'
import { Badge } from '../badge/Badge'
import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NumberCell } from './NumberCell'

export interface TotalCellProps {
  project: ScalingL2SummaryViewEntry
}

export function TotalCell({ project }: TotalCellProps) {
  const tvlWarnings = project.tvlWarnings?.filter(notUndefined)
  const content = project.tvl ? (
    <>
      <NumberCell
        className="font-bold"
        tooltip={tvlWarnings ? undefined : project.tvlTooltip}
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

  if (tvlWarnings?.length) {
    return (
      <Tooltip>
        <TooltipTrigger className="relative flex items-center gap-1">
          {content}
          <RoundedWarningIcon
            className={`absolute -right-4 size-4 ${getSentimentFillColor(tvlWarnings.some((w) => w?.sentiment === 'bad') ? 'bad' : 'warning')}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {tvlWarnings.map((warning, i) => (
            <WarningBar
              key={`tvl-warning-${i}`}
              className="mt-2"
              text={warning.content}
              icon={RoundedWarningIcon}
              color={warning.sentiment === 'warning' ? 'yellow' : 'red'}
            />
          ))}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
