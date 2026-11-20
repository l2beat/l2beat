import type { LiquidStakingSectionProps } from '~/components/projects/sections/defi/LiquidStakingSection'
import {
  ETH_STAKED_TITLE,
  formatEthStaked,
  formatEthStakedWithUsd,
  formatLatestValue,
  formatStakedEthShare,
  LIQUID_STAKING_METRICS,
} from '~/pages/defi/liquid-staking/liquidStakingMetrics'
import {
  formatUsd,
  joinBlocks,
  link,
  NO_DATA,
  table,
  withRegularSpaces,
} from './markdown'
import { formatUtcDateOrDay, formatUtcDateTime } from './renderSectionParts'

/** The same rows as the HTML table, each protocol linked to its page. */
export function renderLiquidStakingSection({
  entries,
  ethStaked,
}: Pick<LiquidStakingSectionProps, 'entries' | 'ethStaked'>) {
  return joinBlocks([
    ethStaked
      ? `${ETH_STAKED_TITLE}: ${withRegularSpaces(formatEthStakedWithUsd(ethStaked.value, ethStaked.valueUsd))} (as of ${formatUtcDateTime(ethStaked.timestamp)})`
      : '',
    table(
      [
        'Name',
        'Tokens',
        'TVL',
        ...LIQUID_STAKING_METRICS.map((metric) => metric.title),
      ],
      entries.map((entry) => [
        `${link(entry.name, entry.href)}${entry.isUnderReview ? ' (under review)' : ''}`,
        entry.tokens
          .map((token) =>
            token.href ? link(token.symbol, token.href) : token.symbol,
          )
          .join(', '),
        formatTvl(entry),
        ...LIQUID_STAKING_METRICS.map((metric) => {
          const latest = entry[metric.key]
          return latest
            ? `${formatLatestValue(metric, latest)} (${formatUtcDateOrDay(latest.timestamp, metric.dailyBuckets)})`
            : NO_DATA
        }),
      ]),
    ),
    `${link('Compare the risks of liquid staking protocols', '/defi/liquid-staking')}.`,
  ])
}

function formatTvl(entry: LiquidStakingSectionProps['entries'][number]) {
  if (entry.totalValueLockedUsd === undefined) return NO_DATA
  const details = [
    entry.totalValueLockedEth !== undefined
      ? withRegularSpaces(formatEthStaked(entry.totalValueLockedEth))
      : undefined,
    entry.stakedEthShare
      ? formatStakedEthShare(entry.stakedEthShare.value)
      : undefined,
  ].filter((detail) => detail !== undefined)
  return details.length > 0
    ? `${formatUsd(entry.totalValueLockedUsd)} (${details.join(', ')})`
    : formatUsd(entry.totalValueLockedUsd)
}
