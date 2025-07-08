import { formatDuration } from '~/components/chart/liveness/LivenessChart'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { anomalySubtypeToLabel } from './AnomalyIndicator'
import { getDurationColorClassName } from './LivenessDurationCell'

export function AnomalyText({
  anomaly,
  className,
}: {
  anomaly: LivenessAnomaly
  className?: string
}) {
  if (anomaly.end === undefined) {
    return (
      <p className={cn('text-paragraph-13', className)}>
        No{' '}
        <span className="font-medium lowercase">
          {anomalySubtypeToLabel(anomaly.subtype)}
        </span>{' '}
        have been performed for the past{' '}
        <span
          className={cn(
            'text-nowrap font-medium',
            getDurationColorClassName(anomaly.durationInSeconds),
          )}
        >
          {formatDuration(anomaly.durationInSeconds)}
        </span>
        {' ('}since{' '}
        <span className="font-medium ">
          {formatTimestamp(anomaly.start, { mode: 'datetime' })}
        </span>
        {')'}. These typically occur every{' '}
        <span
          className={cn(
            'text-nowrap font-medium',
            getDurationColorClassName(anomaly.avgInterval),
          )}
        >
          {formatDuration(anomaly.avgInterval)}
        </span>{' '}
        on average.
      </p>
    )
  }

  return (
    <p className={cn('text-paragraph-13', className)}>
      No{' '}
      <span className="font-medium lowercase">
        {anomalySubtypeToLabel(anomaly.subtype)}
      </span>{' '}
      were performed for{' '}
      <span
        className={cn(
          'text-nowrap font-medium',
          getDurationColorClassName(anomaly.durationInSeconds),
        )}
      >
        {formatDuration(anomaly.durationInSeconds)}
      </span>
      {' ('}from{' '}
      <span className="font-medium">
        {formatTimestamp(anomaly.start, { mode: 'datetime' })}
      </span>{' '}
      until{' '}
      <span className="font-medium">
        {formatTimestamp(anomaly.end, { mode: 'datetime' })}
      </span>
      {')'}. These typically occur every{' '}
      <span
        className={cn(
          'text-nowrap font-medium',
          getDurationColorClassName(anomaly.avgInterval),
        )}
      >
        {formatDuration(anomaly.avgInterval)}
      </span>{' '}
      on average.
    </p>
  )
}
