import { formatSeconds } from '@l2beat/shared-pure'
import { UtcDateTime } from '~/components/core/UtcDateTime'
import { anomalySubtypeToLabel } from '~/components/projects/sections/liveness/anomalySubtypeToLabel'
import type { LivenessAnomaly } from '~/server/features/layer2s/liveness/types'
import { cn } from '~/utils/cn'
import { isAnomalyOngoing } from '~/utils/project/liveness/isAnomalyOngoing'
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
          <UtcDateTime timestamp={anomaly.start} />
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
        <UtcDateTime timestamp={anomaly.start} />
      </span>{' '}
      {anomaly.end && (
        <>
          {' '}
          until{' '}
          <span className="font-medium">
            <UtcDateTime timestamp={anomaly.end} />
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
