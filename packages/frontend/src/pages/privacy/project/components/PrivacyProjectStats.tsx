import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface Props {
  totalValueLockedUsd: number
  assetsCount: number
  bucketsCount: number
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
  activeRelayers30d?: number
}

export function PrivacyProjectStats({
  totalValueLockedUsd,
  assetsCount,
  bucketsCount,
  deposits,
  activeRelayers30d,
}: Props) {
  const hasTrackedAssets = assetsCount > 0
  const hasRelayerTracking = activeRelayers30d !== undefined

  if (!hasTrackedAssets) {
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
          <div className="flex flex-col md:gap-1">
            <span>{formatCurrency(totalValueLockedUsd, 'usd')}</span>
            <span className="font-medium text-paragraph-12 text-secondary leading-normal">
              across {formatInteger(assetsCount ?? 0)} assets and{' '}
              {formatInteger(bucketsCount ?? 0)} buckets
            </span>
          </div>
        }
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="TVL"
        value={formatCurrency(totalValueLockedUsd, 'usd')}
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
      {hasRelayerTracking && (
        <ProjectSummaryStat
          title="Active Relayers 30D"
          value={formatInteger(activeRelayers30d)}
          tooltip="The number of unique relayer addresses observed in relayed withdrawals over the past 30 days."
        />
      )}
    </div>
  )
}
