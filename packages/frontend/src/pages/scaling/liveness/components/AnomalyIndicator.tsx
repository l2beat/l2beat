import { assertUnreachable, pluralize, UnixTime } from '@l2beat/shared-pure'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'

interface Props {
  anomalies: LivenessAnomaly[]
  href?: string
}

export function AnomalyIndicator({ anomalies, href }: Props) {
  const indicators = toAnomalyIndicatorEntries(anomalies)
  const uptimePercentage = calculateUptimePercentage(
    anomalies,
    indicators.length,
  )
  const hasOngoing = anomalies.some((a) => a.end === undefined)

  const content = (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex h-6 w-min gap-x-0.5">
        {indicators.map((indicator, i) => (
          <div
            key={i}
            className={cn(
              'w-0.5 rounded-full',
              indicator === 'none' && 'bg-blue-500',
              indicator === 'recovered' && 'bg-orange-400',
              indicator === 'ongoing' && 'bg-negative',
            )}
          />
        ))}
      </div>
      <span className="whitespace-nowrap font-medium text-2xs text-blue-500 uppercase leading-none">
        {uptimePercentage}% normal uptime
      </span>
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={href} className="cursor-pointer">
          {content}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        {hasOngoing ? (
          <div>There is an ongoing anomaly. Click to learn more.</div>
        ) : anomalies.length === 0 ? (
          <div>No anomalies detected in the last 30 days</div>
        ) : (
          <div>
            There {anomalies.length === 1 ? 'was' : 'were'} {anomalies.length}{' '}
            {pluralize(anomalies.length, 'anomaly', 'anomalies')} over the past
            30 days. Click to learn more.
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

export function anomalySubtypeToLabel(type: LivenessAnomaly['subtype']) {
  switch (type) {
    case 'batchSubmissions':
      return 'Tx data submissions'
    case 'proofSubmissions':
      return 'Proof submissions'
    case 'stateUpdates':
      return 'State updates'
    default:
      assertUnreachable(type)
  }
}

function calculateUptimePercentage(anomalies: LivenessAnomaly[], days: number) {
  const now = UnixTime.now()
  const windowStart = now - (days - 1) * UnixTime.DAY
  const totalHours = days * 24

  // clamp intervals to the window
  const intervals = anomalies
    .map((a) => ({
      start: Math.max(a.start, windowStart),
      end: a.end ? Math.min(a.end, now) : now,
    }))
    .filter((i) => i.end > i.start)
    .sort((a, b) => a.start - b.start)

  let anomalyHours = 0
  // merge overlapping intervals
  let mergedEnd = 0
  for (const interval of intervals) {
    const start = Math.max(interval.start, mergedEnd)
    if (interval.end > start) {
      anomalyHours += (interval.end - start) / UnixTime.HOUR
    }
    mergedEnd = Math.max(mergedEnd, interval.end)
  }

  const percentage = ((totalHours - anomalyHours) / totalHours) * 100
  return Math.floor(percentage)
}

function toAnomalyIndicatorEntries(anomalies: LivenessAnomaly[]) {
  const now = UnixTime.now()
  // We want to show last 30 days with today included so we start 29 days ago
  const thirtyDaysAgo = now - 29 * UnixTime.DAY
  let dayInLoop = thirtyDaysAgo
  const result: ('none' | 'recovered' | 'ongoing')[] = []

  while (dayInLoop <= now) {
    const anomaliesInGivenDay = anomalies.filter((a) => {
      return (
        dayInLoop >= UnixTime.toStartOf(a.start, 'day') &&
        (!a.end || dayInLoop <= UnixTime.toEndOf(a.end, 'day'))
      )
    })

    if (anomaliesInGivenDay.length === 0) {
      result.push('none')
    } else {
      const isAnyOngoing = anomaliesInGivenDay.some((a) => a.end === undefined)
      result.push(isAnyOngoing ? 'ongoing' : 'recovered')
    }

    dayInLoop = dayInLoop + 1 * UnixTime.DAY
  }
  return result
}
