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
import {
  WarningBar,
  sentimentToWarningBarColor,
} from '~/components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import type { ScalingProjectEntry } from '~/server/features/scaling/project/get-scaling-project-entry'

interface Props {
  tokenTvl:
    | NonNullable<ScalingProjectEntry['header']['tvl']>['tokens']
    | undefined
}

export function TokenBreakdownStat({ tokenTvl }: Props) {
  const tokenWarnings = tokenTvl?.warnings ?? []
  const anyBadWarnings = tokenWarnings.some((w) => w.sentiment === 'bad')
  const anyWarningWarnings = tokenWarnings.some(
    (w) => w.sentiment === 'warning',
  )
  const warningSentiment = anyBadWarnings
    ? 'bad'
    : anyWarningWarnings
      ? 'warning'
      : 'neutral'

  if (!tokenTvl?.breakdown || tokenTvl?.breakdown.total === 0) {
    return tokenWarnings.length === 0 ? (
      <NoDataBadge />
    ) : (
      <div className="flex items-center gap-1">
        <NoDataBadge />
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon
              className="size-5"
              sentiment={warningSentiment}
            />
          </TooltipTrigger>
          {tokenWarnings.length > 0 && (
            <TooltipContent className="space-y-2">
              {tokenWarnings?.map((warning, i) => (
                <WarningBar
                  key={`tvl-warning-${i}`}
                  icon={RoundedWarningIcon}
                  text={warning.content}
                  color={sentimentToWarningBarColor(warning.sentiment)}
                  // Cell itself is a href.
                  // Markdown might contain links - nesting them in a tooltip
                  // breaks semantics apart causing significant layout shifts.
                  ignoreMarkdown
                />
              ))}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <TokenBreakdown
          total={tokenTvl.breakdown.total}
          associated={tokenTvl.breakdown.associated}
          ether={tokenTvl.breakdown.ether}
          stablecoin={tokenTvl.breakdown.stablecoin}
        />
        {tokenTvl.warnings.length > 0 && (
          <RoundedWarningIcon sentiment={warningSentiment} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <TokenBreakdownTooltipContent
          total={tokenTvl.breakdown.total}
          associated={tokenTvl.breakdown.associated}
          ether={tokenTvl.breakdown.ether}
          stablecoin={tokenTvl.breakdown.stablecoin}
          associatedTokenSymbols={tokenTvl.associatedTokens}
          tvlWarnings={tokenTvl.warnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
