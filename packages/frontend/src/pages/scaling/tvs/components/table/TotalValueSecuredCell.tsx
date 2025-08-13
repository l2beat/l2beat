import type { WarningWithSentiment } from '@l2beat/config'
import { TokenBreakdown } from '~/components/breakdown/TokenBreakdown'
import { ValueSecuredBreakdown } from '~/components/breakdown/ValueSecuredBreakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { TableLink } from '../../../../../components/table/TableLink'

interface TotalValueSecuredCellProps {
  href: string
  total: number
  breakdown:
    | {
        type: 'bridgeType'
        external: number
        canonical: number
        native: number
      }
    | {
        type: 'assetCategory'
        ether: number
        associated: number
        stablecoin: number
        btc: number
        other: number
      }
  change: number
  tvsWarnings?: WarningWithSentiment[]
}

export function TotalValueSecuredCell(props: TotalValueSecuredCellProps) {
  const tvsWarnings = props.tvsWarnings ?? []
  const anyBadWarnings = tvsWarnings.some((w) => w?.sentiment === 'bad')

  return (
    <Tooltip>
      <TooltipTrigger asChild disabled={tvsWarnings.length === 0}>
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
                {formatDollarValueNumber(props.total)}
              </ValueWithPercentageChange>
            </div>
            {props.breakdown.type === 'bridgeType' ? (
              <ValueSecuredBreakdown
                canonical={props.breakdown.canonical}
                external={props.breakdown.external}
                native={props.breakdown.native}
                className="h-[3px] w-[180px]"
              />
            ) : (
              <TokenBreakdown
                total={props.total}
                ether={props.breakdown.ether}
                stablecoin={props.breakdown.stablecoin}
                btc={props.breakdown.btc}
                other={props.breakdown.other}
                className="h-[3px] w-[180px]"
              />
            )}
          </div>
        </TableLink>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2">
        {tvsWarnings?.map((warning, i) => (
          <div key={i} className="flex gap-2">
            <RoundedWarningIcon
              className="size-4 shrink-0"
              sentiment={warning.sentiment}
            />
            <span>{warning.value}</span>
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  )
}
