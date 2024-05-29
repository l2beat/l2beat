import React from 'react'

import {
  ScalingL2SummaryViewEntry,
  ScalingL3SummaryViewEntry,
} from '../../pages/scaling/summary/types'
import { WarningBar } from '../WarningBar'
import { Badge } from '../badge/Badge'
import { TokenBreakdown } from '../breakdown/TokenBreakdown'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NumberCell } from './NumberCell'

export interface TotalCellProps {
  project: ScalingL2SummaryViewEntry | ScalingL3SummaryViewEntry
  className?: string
}

export function TotalCell({ project, className }: TotalCellProps) {
  const anyBadWarnings = project.tvlWarnings?.some(
    (w) => w?.sentiment === 'bad',
  )

  return (
    <div className={className}>
      {project.tvl ? (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                {project.tvlWarnings?.length && project.tvl ? (
                  <RoundedWarningIcon
                    className="size-4"
                    sentiment={anyBadWarnings ? 'bad' : 'warning'}
                  />
                ) : null}
                <NumberCell
                  className="font-bold"
                  tooltip={project.tvlWarnings ? undefined : project.tvlTooltip}
                >
                  {project.tvl?.displayValue}
                </NumberCell>
                <NumberCell signed className="ml-1 !text-base font-medium">
                  {project.sevenDayChange}
                </NumberCell>
              </div>
              {project.tvlBreakdown ? (
                <TokenBreakdown
                  {...project.tvlBreakdown}
                  className="h-[3px] w-[180px]"
                />
              ) : null}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              {project.tvlBreakdown ? project.tvlBreakdown.label : null}
              {project.tvlWarnings?.map((warning, i) => (
                <WarningBar
                  key={`tvl-warning-${i}`}
                  icon={RoundedWarningIcon}
                  text={warning.content}
                  color={warning.sentiment === 'warning' ? 'yellow' : 'red'}
                />
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Badge type="gray" className="mx-auto translate-x-[11.5px]">
          Coming soon
        </Badge>
      )}
    </div>
  )
}
