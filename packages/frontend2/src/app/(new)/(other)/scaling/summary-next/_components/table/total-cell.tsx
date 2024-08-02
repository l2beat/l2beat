import { type Sentiment } from '@l2beat/shared-pure'
import React from 'react'
import { TokenBreakdown } from '~/app/_components/breakdown/token-breakdown'
import { PercentChange } from '~/app/_components/percent-change'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { WarningBar } from '~/app/_components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatNumber } from '~/utils/format-number'
import { type ScalingSummaryTableRow } from '../../_utils/to-table-rows'

export interface TotalCellProps {
  breakdown: {
    total: number
    ether: number
    stablecoin: number
    associated: number
  }
  change?: number
}

export function TotalCell(data: TotalCellProps) {
  //const anyBadWarnings = data.tvlWarnings.some((w) => w?.sentiment === 'bad')

  // TODO:
  const tvlWarnings: { content: string; sentiment: Sentiment }[] = []
  const anyBadWarnings = false
  const tvlBreakdownLabel = ''

  const totalTvl = data.breakdown.total / 100

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {tvlWarnings.length ? (
              <RoundedWarningIcon
                className="size-4"
                sentiment={anyBadWarnings ? 'bad' : 'warning'}
              />
            ) : null}
            <span className="text-base font-bold md:text-lg">
              ${formatNumber(totalTvl)}
            </span>
            {data.change !== undefined && (
              <PercentChange
                value={data.change}
                className="ml-1 !text-base font-medium"
              />
            )}
          </div>
          <TokenBreakdown
            label={tvlBreakdownLabel} // TODO
            associated={data.breakdown.associated}
            ether={data.breakdown.ether}
            stable={data.breakdown.stablecoin}
            other={
              data.breakdown.total -
              data.breakdown.associated -
              data.breakdown.ether -
              data.breakdown.stablecoin
            }
            className="h-[3px] w-[180px]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-2">
          {tvlBreakdownLabel}
          {tvlWarnings.map((warning, i) => (
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
