import React from 'react'

import {
  ScalingL2SummaryViewEntry,
  ScalingL3SummaryViewEntry,
  TvlData,
} from '../../pages/scaling/summary/types'
import { ExcludeAssociatedTokensWrapper } from '../ExcludeAssociatedTokensWrapper'
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
  return (
    <div className={className}>
      <ExcludeAssociatedTokensWrapper>
        <ExcludeAssociatedTokensWrapper.Included>
          <Content data={project.data} tvlTooltip={project.tvlTooltip} />
        </ExcludeAssociatedTokensWrapper.Included>
        <ExcludeAssociatedTokensWrapper.Excluded>
          <Content
            data={project?.data?.excludedTokens}
            tvlTooltip={project.tvlTooltip}
          />
        </ExcludeAssociatedTokensWrapper.Excluded>
      </ExcludeAssociatedTokensWrapper>
    </div>
  )
}

function Content({
  data,
  tvlTooltip,
}: { data: Omit<TvlData, 'excludedTokens'> | undefined; tvlTooltip?: string }) {
  if (!data) {
    return (
      <Badge type="gray" className="mx-auto translate-x-[11.5px]">
        Coming soon
      </Badge>
    )
  }

  const anyBadWarnings = data.tvlWarnings.some((w) => w?.sentiment === 'bad')

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {data.tvlWarnings.length ? (
              <RoundedWarningIcon
                className="size-4"
                sentiment={anyBadWarnings ? 'bad' : 'warning'}
              />
            ) : null}
            <NumberCell
              className="font-bold"
              tooltip={data.tvlWarnings ? undefined : tvlTooltip}
            >
              {data.tvl.displayValue}
            </NumberCell>
            <NumberCell signed className="ml-1 !text-base font-medium">
              {data.sevenDayChange}
            </NumberCell>
          </div>
          <TokenBreakdown
            {...data.tvlBreakdown}
            className="h-[3px] w-[180px]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-2">
          {data.tvlBreakdown.label}
          {data.tvlWarnings.map((warning, i) => (
            <WarningBar
              key={`tvl-warning-${i}`}
              icon={RoundedWarningIcon}
              text={warning.content}
              color={warning.sentiment === 'warning' ? 'yellow' : 'red'}
              // Cell itself is a href.
              // Markdown might contain links - nesting them in a tooltip
              // breaks semantics apart causing significant layout shifts.
              ignoreMarkdown
            />
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
