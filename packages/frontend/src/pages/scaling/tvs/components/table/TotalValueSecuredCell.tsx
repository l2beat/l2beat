import type { WarningWithSentiment } from '@l2beat/config'
import {
  ValueSecuredBreakdown,
  ValueSecuredBreakdownTooltipContent,
} from '~/components/breakdown/ValueSecuredBreakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { TableLink } from '../../../../../components/table/TableLink'

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
          change={props.change}
          tvsWarnings={tvsWarnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
