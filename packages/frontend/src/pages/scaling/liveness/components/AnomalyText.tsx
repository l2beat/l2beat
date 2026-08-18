import { formatSeconds } from '@l2beat/shared-pure'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { isAnomalyOngoing } from '~/utils/project/liveness/isAnomalyOngoing'
import { anomalySubtypeToLabel } from './AnomalyIndicator'
import { getDurationColorClassName } from './LivenessDurationCell'

export function AnomalyText({
  anomaly,
  className,
}: {
  anomaly: LivenessAnomaly
  className?: string
}) {
  if (isAnomalyOngoing(anomaly)) {
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
          {formatSeconds(anomaly.durationInSeconds)}
        </span>
        {' ('}since{' '}
        <span className="font-medium">
          {formatTimestamp(anomaly.start, { mode: 'datetime' })}
        </span>
        {')'}. These typically occur every{' '}
        <span
          className={cn(
            'text-nowrap font-medium',
            getDurationColorClassName(anomaly.avgInterval),
          )}
        >
          {formatSeconds(anomaly.avgInterval)}
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
        {formatSeconds(anomaly.durationInSeconds)}
      </span>
      {' ('}from{' '}
      <span className="font-medium">
        {formatTimestamp(anomaly.start, { mode: 'datetime' })}
      </span>{' '}
      {anomaly.end && (
        <>
          {' '}
          until{' '}
          <span className="font-medium">
            {formatTimestamp(anomaly.end, { mode: 'datetime' })}
          </span>
        </>
      )}
      {')'}. These typically occur every{' '}
      <span
        className={cn(
          'text-nowrap font-medium',
          getDurationColorClassName(anomaly.avgInterval),
        )}
      >
        {formatSeconds(anomaly.avgInterval)}
      </span>{' '}
      on average.
    </p>
  )
}
