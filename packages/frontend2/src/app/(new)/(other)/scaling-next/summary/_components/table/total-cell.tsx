import React from 'react'
import { TokenBreakdown } from '~/app/_components/breakdown/token-breakdown'
import { PercentChange } from '~/app/_components/percent-change'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { WarningBar } from '~/app/_components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning-icon'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from '~/server/features/scaling/types'
import { formatNumber } from '~/utils/format-number'

type TotalEntry = ScalingSummaryLayer2sEntry | ScalingSummaryLayer3sEntry

export interface TotalCellProps {
  data: NonNullable<TotalEntry['tvlData']>
  className?: string
}

export function TotalCell({ data }: TotalCellProps) {
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
