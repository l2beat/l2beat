import type { WarningWithSentiment } from '@l2beat/config'
import {
  ValueSecuredBreakdown,
  ValueSecuredBreakdownTooltipContent,
} from '~/components/breakdown/value-secured-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'
import { TableLink } from '../../../../../../components/table/table-link'

export interface TotalValueSecuredCellProps {
  href: string
  breakdown: {
    external: number
    canonical: number
    native: number
  }
  change: number
  tvsWarnings?: WarningWithSentiment[]
}

export function TotalValueSecuredCell(props: TotalValueSecuredCellProps) {
  const tvsWarnings = props.tvsWarnings ?? []
  const anyBadWarnings = tvsWarnings.some((w) => w?.sentiment === 'bad')
  const total =
    props.breakdown.canonical +
    props.breakdown.external +
    props.breakdown.native

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TableLink href={props.href}>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              {tvsWarnings.length ? (
                <RoundedWarningIcon
                  className="size-4"
                  sentiment={anyBadWarnings ? 'bad' : 'warning'}
                />
              ) : null}
              <ValueWithPercentageChange change={props.change}>
                {formatDollarValueNumber(total)}
              </ValueWithPercentageChange>
            </div>
            <ValueSecuredBreakdown
              canonical={props.breakdown.canonical}
              external={props.breakdown.external}
              native={props.breakdown.native}
              className="h-[3px] w-[180px]"
            />
          </div>
        </TableLink>
      </TooltipTrigger>
      <TooltipContent>
        <ValueSecuredBreakdownTooltipContent
          canonical={props.breakdown.canonical}
          external={props.breakdown.external}
          native={props.breakdown.native}
          tvsWarnings={tvsWarnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
