import type { WarningWithSentiment } from '@l2beat/config'
import { TokenBreakdown } from '~/components/breakdown/TokenBreakdown'
import { ValueSecuredBreakdown } from '~/components/breakdown/ValueSecuredBreakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { sentimentToWarningBarColor, WarningBar } from '~/components/WarningBar'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'
import { TableLink } from '../../../../../components/table/TableLink'

interface TotalValueSecuredCellProps {
  href: string
  total: number
  breakdown:
    | {
        type: 'source'
        external: number
        canonical: number
        native: number
      }
    | {
        type: 'category'
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
                {formatDollarValueNumber(props.total)}
              </ValueWithPercentageChange>
            </div>
            {props.breakdown.type === 'source' ? (
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
      <TooltipContent className="p-0!">
        {tvsWarnings?.map((warning, i) => (
          <WarningBar
            key={`tvs-warning-${i}`}
            icon={RoundedWarningIcon}
            text={warning.value}
            color={sentimentToWarningBarColor(warning.sentiment)}
            // Cell itself is a href.
            // Markdown might contain links - nesting them in a tooltip
            // breaks semantics apart causing significant layout shifts.
            ignoreMarkdown
          />
        ))}
      </TooltipContent>
    </Tooltip>
  )
}
