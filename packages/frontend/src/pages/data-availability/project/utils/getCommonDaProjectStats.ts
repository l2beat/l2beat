import {
  formatBpsToMbps,
  formatCurrency,
  formatNumber,
  UnixTime,
} from '@l2beat/shared-pure'
import round from 'lodash/round'
import { EM_DASH } from '~/consts/characters'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'

export interface DaProjectStat {
  key: string
  title: string
  value: string
  tooltip?: string
}

/**
 * The stats every DA project page opens with. Plain strings, so the HTML
 * stats block and the markdown alternate state the same facts.
 */
export function getCommonDaProjectStats(
  project: DaProjectPageEntry | EthereumDaProjectPageEntry,
): DaProjectStat[] {
  const stats: DaProjectStat[] = []

  stats.push({
    key: 'type',
    title: 'Type',
    value: project.type,
  })

  stats.push({
    key: 'tvs',
    title: 'Total Value Secured',
    value: formatCurrency(project.header.tvs, 'usd'),
    tooltip:
      'Total value secured (TVS) is the sum of the total value secured across all L2s & L3s that use this DA layer and are listed on L2BEAT. It does not include the TVS of sovereign rollups.',
  })

  stats.push({
    key: 'economic-security',
    title: 'Economic security',
    value: project.header.economicSecurity
      ? formatCurrency(project.header.economicSecurity, 'usd')
      : EM_DASH,
    tooltip:
      'The assets that are slashable in case of a data withholding attack. For public blockchains, it is equal to 2/3 of the total validating stake.',
  })

  if (project.header.numberOfValidators) {
    stats.push({
      key: 'validators',
      title: 'Secured by',
      value:
        project.slug === 'ethereum'
          ? `${formatNumber(project.header.numberOfValidators)} validators`
          : project.type === 'Public Blockchain'
            ? `${project.header.numberOfValidators} validators`
            : `${project.header.numberOfValidators} operators`,
    })
  }

  stats.push({
    key: 'duration-of-storage',
    title: 'Duration of storage',
    ...getDurationOfStorage(project),
  })

  if (project.header.maxThroughputPerSecond) {
    stats.push({
      key: 'max-throughput',
      title: 'Max throughput',
      value: formatBpsToMbps(project.header.maxThroughputPerSecond),
    })
  }

  return stats
}

function getDurationOfStorage({
  kind,
  header: { durationStorage },
}: DaProjectPageEntry | EthereumDaProjectPageEntry) {
  if (!durationStorage) {
    return kind === 'DA Service'
      ? {
          value: 'Flexible',
          tooltip:
            'The duration depends on the offchain configuration of the DAC.',
        }
      : { value: EM_DASH }
  }
  return { value: `${round(durationStorage / UnixTime.DAY, 2)} days` }
}
