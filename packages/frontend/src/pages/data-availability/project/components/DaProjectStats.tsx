import { UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { Fragment } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  ProjectSummaryStat,
  type ProjectSummaryStatProps,
} from '~/components/projects/ProjectSummaryStat'
import { EM_DASH } from '~/consts/characters'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import { cn } from '~/utils/cn'
import { formatBpsToMbps } from '~/utils/number-format/formatBytes'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface Props {
  stats: (ProjectSummaryStatProps & { key: string })[]
  className?: string
}
const GROUPS = 4

export function DaProjectStats({ stats, className }: Props) {
  const chunked = chunkArray(stats, GROUPS)

  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-4', className)}>
      {chunked.map((statGroup, i) => {
        const isLastGroup = i === chunked.length - 1

        return (
          <Fragment key={i}>
            {statGroup.map(({ key, ...stat }) => (
              <ProjectSummaryStat key={key} {...stat} />
            ))}
            {!isLastGroup && (
              <HorizontalSeparator className="col-span-full my-1 max-md:hidden" />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

function chunkArray<T>(array: T[], divider: number): T[][] {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += divider) {
    const chunk = array.slice(i, i + divider)
    chunkedArray.push(chunk)
  }
  return chunkedArray
}

export function getCommonDaProjectStats(
  project: DaProjectPageEntry | EthereumDaProjectPageEntry,
) {
  const stats: (ProjectSummaryStatProps & { key: string })[] = []

  // Type
  stats.push({
    key: 'type',
    title: 'Type',
    value: project.type,
  })

  // TVS
  stats.push({
    key: 'tvs',
    title: 'Total Value Secured',
    value: formatCurrency(project.header.tvs, 'usd'),
    tooltip:
      'Total value secured (TVS) is the sum of the total value secured across all L2s & L3s that use this DA layer and are listed on L2BEAT. It does not include the TVS of sovereign rollups.',
  })

  // Economic security
  stats.push({
    key: 'economic-security',
    title: 'Economic security',
    value: // EC not set
      project.header.economicSecurity
        ? // EC set but no data
          project.header.economicSecurity !== undefined
          ? formatCurrency(project.header.economicSecurity, 'usd')
          : 'No data'
        : EM_DASH,
    tooltip:
      'The assets that are slashable in case of a data withholding attack. For public blockchains, it is equal to 2/3 of the total validating stake.',
  })

  // Duration of storage
  const durationOfStorage =
    project.kind === 'DA Service'
      ? {
          value: 'Flexible',
          tooltip:
            'The duration depends on the offchain configuration of the DAC.',
        }
      : {
          value: project.header.durationStorage
            ? round(project.header.durationStorage / UnixTime.DAY, 2) + ' days'
            : EM_DASH,
        }

  stats.push({
    key: 'duration-of-storage',
    title: 'Duration of storage',
    ...durationOfStorage,
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
