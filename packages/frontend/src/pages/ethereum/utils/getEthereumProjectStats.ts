import {
  formatBpsToMbps,
  formatCurrency,
  formatNumber,
  UnixTime,
} from '@l2beat/shared-pure'
import round from 'lodash/round'
import { EM_DASH } from '~/consts/characters'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

export interface DaProjectStat {
  key: string
  title: string
  value: string
  tooltip?: string
}

/**
 * The stats the page opens with. Plain strings, so the HTML stats block and
 * the markdown alternate state the same facts.
 */
export function getEthereumProjectStats(
  project: EthereumProjectPageEntry,
): DaProjectStat[] {
  const { header } = project
  const stats: DaProjectStat[] = [
    { key: 'type', title: 'Type', value: project.type },
    {
      key: 'tvs',
      title: 'Total Value Secured',
      value: formatCurrency(header.tvs, 'usd'),
      tooltip:
        'Total value secured (TVS) is the sum of the total value secured across all L2s & L3s that use this DA layer and are listed on L2BEAT. It does not include the TVS of sovereign rollups.',
    },
    {
      key: 'economic-security',
      title: 'Economic security',
      // Zero is a value (nothing is slashable); only a missing one is unknown.
      value:
        header.economicSecurity !== undefined
          ? formatCurrency(header.economicSecurity, 'usd')
          : EM_DASH,
      tooltip:
        'The assets that are slashable in case of a data withholding attack. For public blockchains, it is equal to 2/3 of the total validating stake.',
    },
  ]

  if (header.numberOfValidators) {
    stats.push({
      key: 'validators',
      title: 'Secured by',
      value: `${formatNumber(header.numberOfValidators)} validators`,
    })
  }

  stats.push({
    key: 'duration-of-storage',
    title: 'Duration of storage',
    value: header.durationStorage
      ? `${round(header.durationStorage / UnixTime.DAY, 2)} days`
      : EM_DASH,
  })

  if (header.maxThroughputPerSecond) {
    stats.push({
      key: 'max-throughput',
      title: 'Max throughput',
      value: formatBpsToMbps(header.maxThroughputPerSecond),
    })
  }

  return stats
}
