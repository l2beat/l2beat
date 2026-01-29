import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { Fragment } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { env } from '~/env'
import { AnomalyIndicator } from '~/pages/scaling/liveness/components/AnomalyIndicator'
import { DurationCell } from '~/pages/scaling/liveness/components/table/DurationCell'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'

export function LivenessChartStats({
  stats,
  anomalies,
  hasTrackedContractsChanged,
  isLoading,
  configuredSubtypes,
  isArchived,
}: {
  stats:
    | Partial<
        Record<'stateUpdates' | 'batchSubmissions' | 'proofSubmissions', number>
      >
    | undefined
  anomalies: LivenessAnomaly[]
  configuredSubtypes: TrackedTxsConfigSubtype[]
  hasTrackedContractsChanged: boolean
  isLoading: boolean
  isArchived: boolean
}) {
  const elements = compact([
    configuredSubtypes.includes('batchSubmissions') && (
      <ChartStatsItem isLoading={isLoading} label="Avg. tx data subs. interval">
        {stats?.batchSubmissions && (
          <DurationCell durationInSeconds={stats?.batchSubmissions} />
        )}
      </ChartStatsItem>
    ),
    configuredSubtypes.includes('proofSubmissions') && (
      <ChartStatsItem isLoading={isLoading} label="Avg. proof subs. interval">
        {stats?.proofSubmissions && (
          <DurationCell durationInSeconds={stats?.proofSubmissions} />
        )}
      </ChartStatsItem>
    ),
    configuredSubtypes.includes('stateUpdates') && (
      <ChartStatsItem isLoading={isLoading} label="Avg. state updates interval">
        {stats?.stateUpdates && (
          <DurationCell durationInSeconds={stats?.stateUpdates} />
        )}
      </ChartStatsItem>
    ),
    !isArchived && (
      <ChartStatsItem key="anomalies" label="Past 30 days anomalies">
        {env.CLIENT_SIDE_TRACKED_TXS_OUTAGE ? (
          <NoDataBadge />
        ) : (
          <AnomalyIndicator
            anomalies={anomalies}
            hasTrackedContractsChanged={hasTrackedContractsChanged}
          />
        )}
      </ChartStatsItem>
    ),
  ])

  return (
    <ChartStats
      className={cn(
        'mt-4',
        elements.length === 1 && 'lg:grid-cols-1',
        elements.length === 2 && 'lg:grid-cols-2',
        elements.length === 3 && 'lg:grid-cols-3',
        elements.length === 4 && 'lg:grid-cols-4',
      )}
    >
      {elements.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </ChartStats>
  )
}
