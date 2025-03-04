import type { WarningWithSentiment } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/components/breakdown/token-breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import {
  WarningBar,
  sentimentToWarningBarColor,
} from '~/components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatDollarValueNumber } from '~/utils/number-format/format-dollar-value-number'
import { TableLink } from './table-link'

export interface TotalCellProps {
  breakdown:
    | {
        total: number
        ether: number
        stablecoin: number
        associated: number
      }
    | undefined
  associatedTokenSymbols: string[]
  href: string
  change?: number
  tvsWarnings?: WarningWithSentiment[]
}

export function TotalCell(props: TotalCellProps) {
  const tvsWarnings = props.tvsWarnings ?? []
  const anyBadWarnings = tvsWarnings.some((w) => w.sentiment === 'bad')
  const anyWarningWarnings = tvsWarnings.some((w) => w.sentiment === 'warning')

  const icon = tvsWarnings.length ? (
    <RoundedWarningIcon
      className="mr-1 size-4"
      sentiment={
        anyBadWarnings ? 'bad' : anyWarningWarnings ? 'warning' : 'neutral'
      }
    />
  ) : null
  if (props.breakdown?.total === undefined) {
    return (
      <Tooltip>
        <TooltipTrigger className="flex items-center">
          {icon}
          <NoDataBadge />
        </TooltipTrigger>
        <TooltipContent className="space-y-2">
          <span>Data is not available for this project.</span>
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

  const totalTvs = props.breakdown.total

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile>
        <TableLink href={props.href}>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              {icon}
              <ValueWithPercentageChange change={props.change}>
                {formatDollarValueNumber(totalTvs)}
              </ValueWithPercentageChange>
            </div>
            <TokenBreakdown
              total={props.breakdown.total}
              associated={props.breakdown.associated}
              ether={props.breakdown.ether}
              stablecoin={props.breakdown.stablecoin}
              className="h-[3px] w-[180px]"
            />
          </div>
        </TableLink>
      </TooltipTrigger>
      <TooltipContent>
        <TokenBreakdownTooltipContent
          total={props.breakdown.total}
          associated={props.breakdown.associated}
          ether={props.breakdown.ether}
          stablecoin={props.breakdown.stablecoin}
          tvsWarnings={tvsWarnings}
          associatedTokenSymbols={props.associatedTokenSymbols}
        />
      </TooltipContent>
    </Tooltip>
  )
}
