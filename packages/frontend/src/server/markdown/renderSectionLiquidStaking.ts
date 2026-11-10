import type { LiquidStakingSectionProps } from '~/components/projects/sections/defi/LiquidStakingSection'
import {
  ETH_STAKED_TITLE,
  formatEthStaked,
  formatLatestValue,
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
import { formatUtcDateTime } from './renderSectionParts'

/** The same rows as the HTML table, each protocol linked to its page. */
export function renderLiquidStakingSection({
  entries,
  ethStaked,
}: Pick<LiquidStakingSectionProps, 'entries' | 'ethStaked'>) {
  return joinBlocks([
    ethStaked
      ? `${ETH_STAKED_TITLE}: ${withRegularSpaces(formatEthStaked(ethStaked.value))} (as of ${formatUtcDateTime(ethStaked.timestamp)})`
      : '',
    table(
      [
        'Name',
        'Tokens',
        'TVL',
        ...LIQUID_STAKING_METRICS.map((metric) => metric.title),
      ],
      entries.map((entry) => [
        link(entry.name, entry.href),
        entry.tokens.join(', '),
        entry.totalValueLockedUsd !== undefined
          ? formatUsd(entry.totalValueLockedUsd)
          : NO_DATA,
        ...LIQUID_STAKING_METRICS.map((metric) => {
          const latest = entry[metric.key]
          return latest ? formatLatestValue(metric, latest) : NO_DATA
        }),
      ]),
    ),
    `${link('Compare the risks of liquid staking protocols', '/defi/liquid-staking')}.`,
  ])
}
