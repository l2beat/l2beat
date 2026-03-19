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

  const bars = (
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
  )

  if (!href) {
    return bars
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={href} className="cursor-pointer">
          {bars}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        {anomalies.length === 0 ? (
          <div>No anomalies detected in the last 30 days</div>
        ) : (
          <div>
            There {anomalies.length === 1 ? 'was' : 'were'}{' '}
            {anomalies.length}{' '}
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
