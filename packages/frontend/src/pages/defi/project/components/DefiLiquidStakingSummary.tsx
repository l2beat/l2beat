import type { ProjectDefiLiquidStakingRisks } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { Fragment } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  ProjectSummaryStat,
  type ProjectSummaryStatProps,
} from '~/components/projects/ProjectSummaryStat'
import { SentimentText } from '~/components/SentimentText'
import {
  formatDays,
  type LiquidStakingMetric,
} from '~/server/features/defi/liquidStakingCharts/liquidStakingMetrics'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { cn } from '~/utils/cn'

type RiskKey = keyof ProjectDefiLiquidStakingRisks

/** The summary table's columns for this protocol, in the same order. */
const RISK_STATS: [RiskKey, string][] = [
  ['minting', 'Minting'],
  ['operators', 'Node operators'],
  ['backing', 'Backing'],
  ['exchangeRate', 'Oracle'],
  ['exit', 'Exit'],
  ['upgrades', 'Upgrades'],
]

/**
 * What the liquid staking summary page shows for this protocol, as the
 * stats block of its page: the metrics first, then the six risk dimensions.
 */
export function DefiLiquidStakingSummary({
  liquidStaking,
  tokens,
  totalValueLockedUsd,
  className,
}: {
  liquidStaking: NonNullable<ProjectDefiEntry['liquidStaking']>
  tokens: ProjectDefiEntry['tokens']
  totalValueLockedUsd: number | undefined
  className?: string
}) {
  const { risks, metrics } = liquidStaking
  const groups: (ProjectSummaryStatProps & { key: string })[][] = [
    [
      {
        key: 'tvl',
        title: 'TVL',
        value: formatOrNoData(totalValueLockedUsd, (value) =>
          formatCurrency(value, 'usd'),
        ),
        tooltip: 'Total USD value of assets locked in the protocol.',
      },
      {
        key: 'yield',
        title: 'Yield',
        value: formatOrNoData(
          metrics?.yield30d,
          (value) => `${(value * 100).toFixed(2)}%`,
        ),
        tooltip: metricTooltip(
          metrics?.yield30d,
          "Annualised drift of the token's own oracle rate over the previous 30 days, net of protocol fees.",
        ),
      },
      {
        key: 'exit-cost',
        title: 'Cost of exit',
        value: formatOrNoData(metrics?.exitCostDays, (value) =>
          formatDays(value),
        ),
        tooltip: metricTooltip(
          metrics?.exitCostDays,
          'Days of staking yield an exit cost, by the cheaper route: waiting for a protocol withdrawal or selling at the market discount.',
        ),
      },
      {
        key: 'tokens',
        title: 'Tokens',
        value:
          tokens.length > 0 ? (
            <a href="#tokens">{tokens.map((t) => t.symbol).join(', ')}</a>
          ) : (
            <NoDataBadge />
          ),
      },
    ],
    RISK_STATS.map(([key, title]) => ({
      key,
      title,
      tooltip: risks[key].description,
      value: (
        <span className="flex flex-col">
          <SentimentText sentiment={risks[key].sentiment ?? 'neutral'}>
            {risks[key].value}
          </SentimentText>
          {risks[key].secondLine && (
            <span className="font-medium text-secondary text-xs">
              {risks[key].secondLine}
            </span>
          )}
        </span>
      ),
    })),
  ]

  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-4', className)}>
      {groups.map((group, index) => (
        <Fragment key={index}>
          {group.map(({ key, ...stat }) => (
            <ProjectSummaryStat key={key} {...stat} />
          ))}
          {index < groups.length - 1 && (
            <HorizontalSeparator className="col-span-full my-1 max-md:hidden" />
          )}
        </Fragment>
      ))}
    </div>
  )
}

function formatOrNoData(
  metric: LiquidStakingMetric | number | undefined,
  format: (value: number) => string,
) {
  if (metric === undefined) {
    return <NoDataBadge />
  }
  return format(typeof metric === 'number' ? metric : metric.value)
}

function metricTooltip(metric: LiquidStakingMetric | undefined, text: string) {
  return metric
    ? `${text} Static snapshot, last value on ${metric.date}.`
    : `${text} Not in the snapshot.`
}
