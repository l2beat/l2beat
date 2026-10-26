import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { PercentChange } from '~/components/PercentChange'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import type { PrivacyRelayerStat } from '~/server/features/privacy/types'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import {
  PRIVACY_PROJECT_STATS_COPY as COPY,
  RELAYER_STAT_COPY,
} from './privacyProjectStatsCopy'

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
        <NotTrackedStat className="md:col-span-4" {...COPY.untrackedMetrics} />
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
            title={COPY.totalValueLocked}
            value={
              <TvlValue
                totalValueLockedUsd={totalValueLockedUsd}
                change7d={totalValueLockedChange7d}
              />
            }
          />
        )}
        <NotTrackedStat {...COPY.untrackedAssetMetrics} />
        {relayerStatElement}
      </div>
    )
  }

  // Columns never get narrower than their title or value, so neither wraps
  // nor spills past the separator.
  return (
    <div
      className={cn(
        'grid gap-4',
        hasRelayerTracking
          ? 'md:grid-cols-[repeat(5,minmax(max-content,1fr))]'
          : 'md:grid-cols-[repeat(4,minmax(max-content,1fr))]',
      )}
    >
      <ProjectSummaryStat
        className="max-md:hidden"
        title={COPY.totalValueLocked}
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
              {/* contain-inline-size: wrap this line instead of widening the column */}
              <span className="font-medium text-paragraph-12 text-secondary leading-normal contain-inline-size">
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
        title={COPY.assetsTracked}
        value={formatInteger(assetsCount ?? 0)}
      />
      <ProjectSummaryStat
        className="md:hidden"
        title={COPY.bucketsTracked}
        value={formatInteger(bucketsCount ?? 0)}
      />
      <ProjectSummaryStat
        title={COPY.deposits7d}
        value={
          <SummaryValueWithChange
            value={formatInteger(deposits.last7d ?? 0)}
            change={deposits.change7d}
            period="last7d"
          />
        }
      />
      <ProjectSummaryStat
        title={COPY.deposits30d}
        value={formatInteger(deposits.last30d ?? 0)}
      />
      <ProjectSummaryStat
        title={COPY.depositsTotal}
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
    <SummaryValueWithChange
      value={formatCurrency(totalValueLockedUsd, 'usd')}
      change={change7d}
      period="7D"
    />
  )
}

// formatNumber joins "25.48" and "K" with a breakable hair space, hence nowrap.
// leading-none keeps the row as tall as a plain value, so values line up.
function SummaryValueWithChange({
  value,
  change,
  period,
}: {
  value: string
  change: number | undefined
  period: PercentageChangePeriod
}) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap">
      {value}
      {change !== undefined && (
        <PercentChange
          value={change}
          period={period}
          textClassName="leading-none"
        />
      )}
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
        <div className="flex flex-col max-md:items-end max-md:text-right md:gap-1">
          <span>{COPY.notTracked}</span>
          <span className="font-medium text-paragraph-12 text-secondary leading-normal">
            {description}
          </span>
        </div>
      }
    />
  )
}
