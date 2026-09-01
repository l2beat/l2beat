import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import type { PrivacyRelayerStat } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'

const RELAYER_STAT_COPY: Record<
  PrivacyRelayerStat['kind'],
  { title: string; tooltip: string }
> = {
  activeRelayers: {
    title: 'Active Relayers 30D',
    tooltip:
      'The number of unique relayer addresses observed in relayed withdrawals over the past 30 days.',
  },
  avgDailyRelayers: {
    title: 'Avg. Relayers 30D',
    tooltip:
      'The average number of unique relayers seen advertising their services in daily network observations over the past 30 days.',
  },
}

interface Props {
  totalValueLockedUsd: number | undefined
  hasTvl: boolean
  assetsCount: number
  bucketsCount: number
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  relayerStat?: PrivacyRelayerStat
}

export function PrivacyProjectStats({
  totalValueLockedUsd,
  hasTvl,
  assetsCount,
  bucketsCount,
  deposits,
  relayerStat,
}: Props) {
  const hasFlowTracking = bucketsCount > 0
  const hasRelayerTracking = relayerStat !== undefined
  const relayerStatElement = hasRelayerTracking ? (
    <ProjectSummaryStat
      title={RELAYER_STAT_COPY[relayerStat.kind].title}
      value={formatInteger(relayerStat.value)}
      tooltip={RELAYER_STAT_COPY[relayerStat.kind].tooltip}
    />
  ) : undefined

  if (!hasFlowTracking && !hasRelayerTracking) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <ProjectSummaryStat
          className="md:col-span-4"
          title="Live metrics"
          value={
            <div className="flex flex-col md:gap-1">
              <span>Not tracked</span>
              <span className="font-medium text-paragraph-12 text-secondary leading-normal">
                Onchain monitoring is not available for this project.
              </span>
            </div>
          }
        />
      </div>
    )
  }

  if (!hasFlowTracking) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <ProjectSummaryStat
          title="Live asset metrics"
          value={
            <div className="flex flex-col md:gap-1">
              <span>Not tracked</span>
              <span className="font-medium text-paragraph-12 text-secondary leading-normal">
                Onchain asset monitoring is not available for this project.
              </span>
            </div>
          }
        />
        {relayerStatElement}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        hasRelayerTracking ? 'md:grid-cols-5' : 'md:grid-cols-4',
      )}
    >
      <ProjectSummaryStat
        className="max-md:hidden"
        title="Total Value Locked"
        value={
          !hasTvl ? (
            <NotApplicableBadge />
          ) : totalValueLockedUsd === undefined ? (
            <NoDataBadge />
          ) : (
            <div className="flex flex-col md:gap-1">
              <span>{formatCurrency(totalValueLockedUsd, 'usd')}</span>
              <span className="font-medium text-paragraph-12 text-secondary leading-normal">
                across {formatInteger(assetsCount ?? 0)} assets and{' '}
                {formatInteger(bucketsCount ?? 0)} buckets
              </span>
            </div>
          )
        }
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="TVL"
        value={
          !hasTvl ? (
            <NotApplicableBadge />
          ) : totalValueLockedUsd === undefined ? (
            <NoDataBadge />
          ) : (
            formatCurrency(totalValueLockedUsd, 'usd')
          )
        }
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="Assets tracked"
        value={formatInteger(assetsCount ?? 0)}
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="Buckets tracked"
        value={formatInteger(bucketsCount ?? 0)}
      />
      <ProjectSummaryStat
        title="Deposits 7D"
        value={formatInteger(deposits.last7d ?? 0)}
      />
      <ProjectSummaryStat
        title="Deposits 30D"
        value={formatInteger(deposits.last30d ?? 0)}
      />
      <ProjectSummaryStat
        title="Deposits Total"
        value={formatInteger(deposits.total ?? 0)}
      />
      {relayerStatElement}
    </div>
  )
}
