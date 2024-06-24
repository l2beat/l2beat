import React from 'react'
import { type ScalingSummaryLayer2sEntry } from '~/server/features/scaling/get-scaling-summary-entries'
import { PercentChange } from '~/app/_components/percent-change'
import { Badge } from '~/app/_components/badge/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning-icon'
import { TokenBreakdown } from '~/app/_components/breakdown/token-breakdown'
import { WarningBar } from '~/app/_components/warning-bar'
import { formatNumber } from '~/utils/format-number'

export interface TotalCellProps {
  data: ScalingSummaryLayer2sEntry['tvlData']
  className?: string
}

export function TotalCell({ data }: TotalCellProps) {
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
            <span className="text-base md:text-lg font-bold">
              ${formatNumber(data.tvl)}
            </span>
            <PercentChange
              value={data.sevenDayChange}
              className="!text-base ml-1 font-medium"
            />
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
