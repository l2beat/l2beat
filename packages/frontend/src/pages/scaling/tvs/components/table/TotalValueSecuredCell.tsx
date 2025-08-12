import type { WarningWithSentiment } from '@l2beat/config'
import { TokenBreakdown } from '~/components/breakdown/TokenBreakdown'
import { ValueSecuredBreakdown } from '~/components/breakdown/ValueSecuredBreakdown'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { TableLink } from '../../../../../components/table/TableLink'

interface TotalValueSecuredCellProps {
  href: string
  breakdown:
    | {
        type: 'bridging'
        external: number
        canonical: number
        native: number
      }
    | {
        type: 'token'
        ether: number
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
  const total =
    props.breakdown.type === 'bridging'
      ? props.breakdown.canonical +
        props.breakdown.external +
        props.breakdown.native
      : props.breakdown.ether +
        props.breakdown.stablecoin +
        props.breakdown.btc +
        props.breakdown.other

  return (
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
        {props.breakdown.type === 'bridging' ? (
          <ValueSecuredBreakdown
            canonical={props.breakdown.canonical}
            external={props.breakdown.external}
            native={props.breakdown.native}
            className="h-[3px] w-[180px]"
          />
        ) : (
          <TokenBreakdown
            total={total}
            associated={0}
            ether={props.breakdown.ether}
            stablecoin={props.breakdown.stablecoin}
            btc={props.breakdown.btc}
            className="h-[3px] w-[180px]"
          />
        )}
      </div>
    </TableLink>
  )
}
