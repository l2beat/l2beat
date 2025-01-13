import { type WarningWithSentiment } from '@l2beat/config'
import {
  ValueLockedBreakdown,
  ValueLockedBreakdownTooltipContent,
} from '~/components/breakdown/value-locked-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'

export interface TotalValueLockedCellProps {
  breakdown: {
    external: number
    canonical: number
    native: number
  }
  change: number
  tvlWarnings?: WarningWithSentiment[]
}

export function TotalValueLockedCell(data: TotalValueLockedCellProps) {
  const tvlWarnings = data.tvlWarnings ?? []
  const anyBadWarnings = tvlWarnings.some((w) => w?.sentiment === 'bad')
  const total =
    data.breakdown.canonical + data.breakdown.external + data.breakdown.native

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
            <ValueWithPercentageChange change={data.change}>
              {formatDollarValueNumber(total)}
            </ValueWithPercentageChange>
          </div>
          <ValueLockedBreakdown
            canonical={data.breakdown.canonical}
            external={data.breakdown.external}
            native={data.breakdown.native}
            className="h-[3px] w-[180px]"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <ValueLockedBreakdownTooltipContent
          canonical={data.breakdown.canonical}
          external={data.breakdown.external}
          native={data.breakdown.native}
          tvlWarnings={tvlWarnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
