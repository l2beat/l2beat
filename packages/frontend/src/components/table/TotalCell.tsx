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
  const anyBadWarnings = project.data?.tvlWarnings.some(
    (w) => w?.sentiment === 'bad',
  )

  return (
    <div className={className}>
      {project.data ? (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                {project.data.tvlWarnings.length ? (
                  <RoundedWarningIcon
                    className="size-4"
                    sentiment={anyBadWarnings ? 'bad' : 'warning'}
                  />
                ) : null}
                <NumberCell
                  className="font-bold"
                  tooltip={
                    project.data.tvlWarnings ? undefined : project.tvlTooltip
                  }
                >
                  {project.data.tvl.displayValue}
                </NumberCell>
                <NumberCell signed className="ml-1 !text-base font-medium">
                  {project.data.sevenDayChange}
                </NumberCell>
              </div>
              <TokenBreakdown
                {...project.data.tvlBreakdown}
                className="h-[3px] w-[180px]"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              {project.data.tvlBreakdown.label}
              {project.data.tvlWarnings.map((warning, i) => (
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
