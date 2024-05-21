import React from 'react'

import { ScalingL2SummaryViewEntry } from '../../pages/scaling/summary/types'
import { Callout } from '../Callout'
import { WarningBar } from '../WarningBar'
import { Badge } from '../badge/Badge'
import { TokenBreakdown } from '../breakdown/TokenBreakdown'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { NumberCell } from './NumberCell'

export interface TotalCellProps {
  project: ScalingL2SummaryViewEntry
}

export function TotalCell({ project }: TotalCellProps) {
  const anyBadWarnings = project.tvlWarnings?.some(
    (w) => w?.sentiment === 'bad',
  )

  return (
    <div>
      {project.tvl ? (
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {project.tvlWarnings?.length && project.tvl ? (
              <Tooltip>
                <TooltipTrigger>
                  <RoundedWarningIcon
                    className="size-4"
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
            <Tooltip>
              <TooltipTrigger>
                <TokenBreakdown
                  {...project.tvlBreakdown}
                  className="h-[3px] w-[180px]"
                />
              </TooltipTrigger>
              <TooltipContent>
                {project.tvlBreakdown.label}
                {project.tvlBreakdown.warning && (
                  <WarningBar
                    className="mt-2"
                    text={project.tvlBreakdown.warning}
                    icon={RoundedWarningIcon}
                    color={
                      project.tvlBreakdown.warningSeverity === 'warning'
                        ? 'yellow'
                        : 'red'
                    }
                  />
                )}
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      ) : (
        <Badge type="gray" className="mx-auto translate-x-[11.5px]">
          Coming soon
        </Badge>
      )}
    </div>
  )
}
