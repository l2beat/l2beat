import type { LiquidStakingSectionProps } from '~/components/projects/sections/defi/LiquidStakingSection'
import {
  CONSENSUS_THRESHOLDS,
  ETH_STAKED_TITLE,
  formatEthStaked,
  formatEthStakedWithUsd,
  formatLatestValue,
  formatStakedEthShare,
  LIQUID_STAKING_METRICS,
} from '~/pages/defi/liquid-staking/liquidStakingMetrics'
import { getLargestOperator } from '../features/defi/liquid-staking/getLiquidStakingOperators'
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
    ethStaked
      ? [
          'Shares of stake that change what validators acting together can do:',
          ...CONSENSUS_THRESHOLDS.map(
            (threshold) =>
              `- ${threshold.fraction} (${withRegularSpaces(formatEthStaked(ethStaked.value * threshold.share))}), ${threshold.title.toLowerCase()}: ${threshold.description}`,
          ),
        ].join('\n')
      : '',
    renderOperators(entries),
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
        entry.totalValueLockedUsd !== undefined
          ? `${formatUsd(entry.totalValueLockedUsd)}${entry.stakedEthShare ? ` (${formatStakedEthShare(entry.stakedEthShare.value)})` : ''}`
          : NO_DATA,
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

/** Who runs each protocol's validators, for the protocols we can trace. */
function renderOperators(
  entries: LiquidStakingSectionProps['entries'],
): string {
  const traced = entries.flatMap((entry) =>
    entry.operators ? [{ entry, operators: entry.operators }] : [],
  )
  const first = traced[0]
  if (!first) return ''
  return [
    `Who runs the validators, from the beacon chain at ${formatUtcDateTime(first.operators.timestamp)}:`,
    ...traced.map(({ entry, operators }) => {
      const largest = getLargestOperator(operators.operators)
      return `- ${entry.name}: ${operators.operatorCount.toLocaleString('en-US')} operators${largest ? `; the largest, ${largest.name}, runs ${formatStakedEthShare(largest.stakedEthShare)}` : ''}`
    }),
  ].join('\n')
}
