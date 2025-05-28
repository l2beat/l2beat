import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { Fragment } from 'react'
import { DurationCell } from '~/app/(side-nav)/scaling/finality/_components/table/duration-cell'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/chart-stats'
import { AnomalyIndicator } from '~/pages/scaling/liveness/components/anomaly-indicator'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import type { LivenessChartTimeRange } from '~/server/features/scaling/liveness/utils/chart-range'
import { cn } from '~/utils/cn'

export function LivenessChartStats({
  stats,
  anomalies,
  hasTrackedContractsChanged,
  isLoading,
  configuredSubtypes,
  timeRange,
}: {
  stats:
    | Partial<
        Record<'stateUpdates' | 'batchSubmissions' | 'proofSubmissions', number>
      >
    | undefined
  timeRange: LivenessChartTimeRange
  anomalies: LivenessAnomaly[]
  configuredSubtypes: TrackedTxsConfigSubtype[]
  hasTrackedContractsChanged: boolean
  isLoading: boolean
}) {
  const timeRangeLabel = timeRange.toUpperCase()
  const elements = compact([
    configuredSubtypes.includes('batchSubmissions') && (
      <ChartStatsItem
        isLoading={isLoading}
        label={`${timeRangeLabel} avg. tx data subs. interval`}
      >
        {stats?.batchSubmissions && (
          <DurationCell durationInSeconds={stats?.batchSubmissions} />
        )}
      </ChartStatsItem>
    ),
    configuredSubtypes.includes('proofSubmissions') && (
      <ChartStatsItem
        isLoading={isLoading}
        label={`${timeRangeLabel} avg. proof subs. interval`}
      >
        {stats?.proofSubmissions && (
          <DurationCell durationInSeconds={stats?.proofSubmissions} />
        )}
      </ChartStatsItem>
    ),
    configuredSubtypes.includes('stateUpdates') && (
      <ChartStatsItem
        isLoading={isLoading}
        label={`${timeRangeLabel} avg. state updates interval`}
      >
        {stats?.stateUpdates && (
          <DurationCell durationInSeconds={stats?.stateUpdates} />
        )}
      </ChartStatsItem>
    ),
    <ChartStatsItem key="anomalies" label="Past 30 days anomalies">
      <AnomalyIndicator
        anomalies={anomalies}
        hasTrackedContractsChanged={hasTrackedContractsChanged}
      />
    </ChartStatsItem>,
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
