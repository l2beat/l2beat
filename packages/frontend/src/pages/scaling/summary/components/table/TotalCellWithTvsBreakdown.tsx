import type { WarningWithSentiment } from '@l2beat/config'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
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
import { TableLink } from '~/components/table/TableLink'
import { sentimentToWarningBarColor, WarningBar } from '~/components/WarningBar'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

export interface TotalCellProps {
  breakdown:
    | {
        total: number
        canonical: number
        external: number
        native: number
        associated: number
      }
    | undefined
  associatedTokenSymbols: string[]
  href: string
  change?: number
  tvsWarnings?: WarningWithSentiment[]
}

export function TotalCellWithTvsBreakdown(props: TotalCellProps) {
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

  if (props.breakdown?.total === undefined && tvsWarnings.length > 0) {
    return (
      <Tooltip>
        <TooltipTrigger className="inline-flex items-center">
          {icon}
          <NoDataBadge />
        </TooltipTrigger>
        <TooltipContent className="space-y-2">
          <span>Data is not available for this project.</span>
          {tvsWarnings.map((warning, i) => (
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

  if (props.breakdown?.total === undefined) {
    return <NoDataBadge />
  }

  const totalTvs = props.breakdown.total

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile className="h-full">
        <TableLink href={props.href}>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              {icon}
              <ValueWithPercentageChange change={props.change}>
                {formatDollarValueNumber(totalTvs)}
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
          hideTotal
        />
      </TooltipContent>
    </Tooltip>
  )
}
