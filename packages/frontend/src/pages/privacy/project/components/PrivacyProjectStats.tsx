import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { PercentChange } from '~/components/PercentChange'
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
  totalValueLockedChange7d?: number
  hasTvl: boolean
  assetsCount: number
  bucketsCount: number
  deposits: {
    total: number
    last7d: number
    change7d?: number
    last30d: number
  }
  relayerStat?: PrivacyRelayerStat
}

export function PrivacyProjectStats({
  totalValueLockedUsd,
  totalValueLockedChange7d,
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

  if (!hasFlowTracking && !hasRelayerTracking && !hasTvl) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <NotTrackedStat
          className="md:col-span-4"
          title="Live metrics"
          description="Onchain monitoring is not available for this project."
        />
      </div>
    )
  }

  if (!hasFlowTracking) {
    return (
      <div
        className={cn(
          'grid gap-4',
          hasTvl && hasRelayerTracking ? 'md:grid-cols-3' : 'md:grid-cols-2',
        )}
      >
        {hasTvl && (
          <ProjectSummaryStat
            title="Total Value Locked"
            value={
              <TvlValue
                totalValueLockedUsd={totalValueLockedUsd}
                change7d={totalValueLockedChange7d}
              />
            }
          />
        )}
        <NotTrackedStat
          title="Live asset metrics"
          description="Onchain asset monitoring is not available for this project."
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
              <TvlValue
                totalValueLockedUsd={totalValueLockedUsd}
                change7d={totalValueLockedChange7d}
              />
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
          hasTvl ? (
            <TvlValue
              totalValueLockedUsd={totalValueLockedUsd}
              change7d={totalValueLockedChange7d}
            />
          ) : (
            <NotApplicableBadge />
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
        value={
          <div className="flex items-center gap-2">
            {formatInteger(deposits.last7d ?? 0)}
            {deposits.change7d !== undefined && (
              <PercentChange value={deposits.change7d} period="last7d" />
            )}
          </div>
        }
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

function TvlValue({
  totalValueLockedUsd,
  change7d,
}: {
  totalValueLockedUsd: number | undefined
  change7d?: number
}) {
  if (totalValueLockedUsd === undefined) {
    return <NoDataBadge />
  }
  return (
    <div className="flex items-center gap-2">
      {formatCurrency(totalValueLockedUsd, 'usd')}
      {change7d !== undefined && <PercentChange value={change7d} period="7D" />}
    </div>
  )
}

function NotTrackedStat({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <ProjectSummaryStat
      className={className}
      title={title}
      value={
        <div className="flex flex-col md:gap-1">
          <span>Not tracked</span>
          <span className="font-medium text-paragraph-12 text-secondary leading-normal">
            {description}
          </span>
        </div>
      }
    />
  )
}
