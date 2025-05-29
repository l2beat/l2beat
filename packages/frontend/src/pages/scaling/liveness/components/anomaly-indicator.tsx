import { UnixTime, assertUnreachable } from '@l2beat/shared-pure'
import range from 'lodash/range'

import { Callout } from '~/components/callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { LivenessDurationCell } from './liveness-duration-cell'

const SHOWN_ANOMALIES = 4

interface Props {
  anomalies: LivenessAnomaly[]
  showComingSoon?: boolean
  hasTrackedContractsChanged: boolean
}

export function AnomalyIndicator({
  anomalies,
  showComingSoon,
  hasTrackedContractsChanged,
}: Props) {
  if (showComingSoon) {
    return (
      <div
        className="w-min select-none text-center"
        title="Anomalies coming soon"
      >
        <div className="mx-auto text-secondary">Coming soon</div>
        <div className="flex gap-x-0.5">
          {range(30).map((_, i) => (
            <div key={i} className="size-0.5 rounded-full bg-secondary" />
          ))}
        </div>
      </div>
    )
  }

  const indicators = toAnomalyIndicatorEntries(anomalies)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex h-6 w-min cursor-pointer gap-x-0.5"
          title="Anomalies in the last 30 days"
        >
          {indicators.map((indicator, i) => (
            <div
              key={i}
              className={cn(
                'w-0.5 rounded-full',
                indicator ? 'bg-orange-400' : 'bg-blue-500',
              )}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <AnomalyTooltipContent
          anomalies={anomalies}
          hasTrackedContractsChanged={hasTrackedContractsChanged}
        />
      </TooltipContent>
    </Tooltip>
  )
}

function AnomalyTooltipContent(props: {
  anomalies: LivenessAnomaly[]
  hasTrackedContractsChanged: boolean
}) {
  const anomalies = props.anomalies.reverse()

  if (anomalies.length === 0) {
    return <div>No anomalies detected in the last 30 days</div>
  }

  return (
    <>
      <span>Anomalies from last 30 days:</span>
      <div className="-mx-4 mt-2 list-disc">
        {anomalies.slice(0, SHOWN_ANOMALIES).map((anomaly) => {
          const endDate = anomaly.timestamp + anomaly.durationInSeconds
          const endDateUnixTime = UnixTime(endDate)
          const isLive = UnixTime.now() - 4 * UnixTime.HOUR <= endDateUnixTime
          return (
            <div
              className="space-y-0.5 border-t border-divider px-4 py-2"
              key={anomaly.timestamp}
            >
              {isLive && (
                <div className="mb-1 flex items-center justify-center gap-2 rounded bg-red-500/10 py-1 text-red-500">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                  </span>
                  <span className="font-medium">Ongoing anomaly</span>
                </div>
              )}
              {isLive && props.hasTrackedContractsChanged && (
                <Callout
                  className="rounded px-3 py-2 text-[13px] leading-[130%]"
                  color="yellow"
                  small
                  icon={
                    <RoundedWarningIcon
                      className="size-4"
                      sentiment="warning"
                    />
                  }
                  body={
                    <>
                      There are implementation changes, data might be incorrect.
                    </>
                  }
                />
              )}
              <div className="flex justify-between gap-2">
                Start:
                <span>
                  {formatTimestamp(anomaly.timestamp, {
                    mode: 'datetime',
                  })}
                </span>
              </div>
              {isLive ? (
                <div className="flex justify-between gap-2">
                  Last synced:
                  <span>
                    {formatTimestamp(endDate, {
                      mode: 'datetime',
                    })}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between gap-2">
                  End:
                  <span>
                    {formatTimestamp(endDate, {
                      mode: 'datetime',
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                Duration:
                <LivenessDurationCell
                  durationInSeconds={anomaly.durationInSeconds}
                />
              </div>
              <div className="flex justify-between gap-2">
                Type: <AnomalyTypeBadge type={anomaly.type} />
              </div>
            </div>
          )
        })}
      </div>
      {anomalies.length > 4 && (
        <div className="-mx-4 border-t border-divider px-4 pt-2">
          And {anomalies.length - SHOWN_ANOMALIES} more
        </div>
      )}
    </>
  )
}

function AnomalyTypeBadge(props: {
  type: LivenessAnomaly['type']
}) {
  return (
    <span className="w-max rounded bg-orange-400 px-1.5 text-black">
      {typeToLabel(props.type)}
    </span>
  )
}

function typeToLabel(type: LivenessAnomaly['type']) {
  switch (type) {
    case 'batchSubmissions':
      return 'TX DATA SUBMISSIONS'
    case 'proofSubmissions':
      return 'PROOF SUBMISSIONS'
    case 'stateUpdates':
      return 'STATE UPDATES'
    default:
      assertUnreachable(type)
  }
}

function toAnomalyIndicatorEntries(anomalies: LivenessAnomaly[]) {
  const now = UnixTime.now()
  // We want to show last 30 days with today included so we start 29 days ago
  const thirtyDaysAgo = now - 29 * UnixTime.DAY
  let dayInLoop = thirtyDaysAgo
  const result: boolean[] = []

  while (dayInLoop <= now) {
    const anomaliesInGivenDay = anomalies.filter((a) => {
      const startDate = UnixTime(a.timestamp)
      const endDate = startDate + a.durationInSeconds
      return (
        dayInLoop >= UnixTime.toStartOf(startDate, 'day') &&
        dayInLoop <= UnixTime.toEndOf(endDate, 'day')
      )
    })

    if (anomaliesInGivenDay.length === 0) {
      result.push(false)
    } else {
      result.push(true)
    }

    dayInLoop = dayInLoop + 1 * UnixTime.DAY
  }
  return result
}
