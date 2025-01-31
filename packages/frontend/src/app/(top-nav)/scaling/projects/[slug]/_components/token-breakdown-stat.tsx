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
  tokenTvs:
    | NonNullable<ScalingProjectEntry['header']['tvs']>['tokens']
    | undefined
}

export function TokenBreakdownStat({ tokenTvs }: Props) {
  const tokenWarnings = tokenTvs?.warnings ?? []
  const anyBadWarnings = tokenWarnings.some((w) => w.sentiment === 'bad')
  const anyWarningWarnings = tokenWarnings.some(
    (w) => w.sentiment === 'warning',
  )
  const warningSentiment = anyBadWarnings
    ? 'bad'
    : anyWarningWarnings
      ? 'warning'
      : 'neutral'

  if (!tokenTvs?.breakdown || tokenTvs?.breakdown.total === 0) {
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
          )}
        </Tooltip>
      </div>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <TokenBreakdown
          total={tokenTvs.breakdown.total}
          associated={tokenTvs.breakdown.associated}
          ether={tokenTvs.breakdown.ether}
          stablecoin={tokenTvs.breakdown.stablecoin}
        />
        {tokenTvs.warnings.length > 0 && (
          <RoundedWarningIcon sentiment={warningSentiment} />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <TokenBreakdownTooltipContent
          total={tokenTvs.breakdown.total}
          associated={tokenTvs.breakdown.associated}
          ether={tokenTvs.breakdown.ether}
          stablecoin={tokenTvs.breakdown.stablecoin}
          associatedTokenSymbols={tokenTvs.associatedTokens}
          tvsWarnings={tokenTvs.warnings}
        />
      </TooltipContent>
    </Tooltip>
  )
}
