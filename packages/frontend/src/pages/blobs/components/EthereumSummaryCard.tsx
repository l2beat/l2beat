import { formatBpsToMbps, formatNumber, UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import {
  ProjectSummaryStat,
  type ProjectSummaryStatProps,
} from '~/components/projects/ProjectSummaryStat'
import { EM_DASH } from '~/consts/characters'

export interface EthereumSummary {
  name: string
  iconUrl: string
  validators: number | undefined
  /** Seconds a blob is kept for */
  durationStorage: number | undefined
  maxThroughputPerSecond: number | undefined
}

/**
 * Ethereum's key stats as a DA layer. The ones the charts below already show
 * are left out.
 */
export function EthereumSummaryCard({ summary }: { summary: EthereumSummary }) {
  const stats: (ProjectSummaryStatProps & { key: string })[] = [
    {
      key: 'validators',
      title: 'Secured by',
      value:
        summary.validators !== undefined
          ? `${formatNumber(summary.validators)} validators`
          : EM_DASH,
    },
    {
      key: 'duration-of-storage',
      title: 'Duration of storage',
      value: summary.durationStorage
        ? `${round(summary.durationStorage / UnixTime.DAY, 2)} days`
        : EM_DASH,
    },
    {
      key: 'max-throughput',
      title: 'Max throughput',
      value: summary.maxThroughputPerSecond
        ? formatBpsToMbps(summary.maxThroughputPerSecond)
        : EM_DASH,
    },
  ]

  return (
    <PrimaryCard className="flex gap-x-10 gap-y-4 max-md:flex-col md:items-center">
      <div className="flex shrink-0 items-center gap-3">
        <img src={summary.iconUrl} alt="" className="size-8" />
        <h2 className="font-bold text-xl leading-none">{summary.name}</h2>
      </div>
      <ul className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
        {stats.map(({ key, ...stat }) => (
          <ProjectSummaryStat key={key} {...stat} className="md:gap-1" />
        ))}
      </ul>
    </PrimaryCard>
  )
}
