import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'

import { Callout } from '~/components/Callout'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { LiveIndicator } from '~/components/LiveIndicator'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import { cn } from '~/utils/cn'
import { AnomalyText } from './AnomalyText'

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
        <div className="flex h-6 w-min cursor-pointer gap-x-0.5">
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
      </TooltipTrigger>
      <TooltipContent className="max-xs:max-w-[300px]">
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
  if (props.anomalies.length === 0) {
    return <div>No anomalies detected in the last 30 days</div>
  }

  return (
    <>
      <span>Anomalies from last 30 days:</span>
      <div className="-mx-4 mt-2 list-disc">
        {props.anomalies.slice(0, SHOWN_ANOMALIES).map((anomaly) => {
          return (
            <div
              className="space-y-0.5 border-divider border-t px-4 py-2"
              key={anomaly.start}
            >
              {anomaly.end === undefined ? (
                <div className="mb-1 flex items-center gap-1">
                  <LiveIndicator />
                  <span className="text-negative text-subtitle-12 uppercase leading-none">
                    Ongoing anomaly
                  </span>
                </div>
              ) : (
                <span className="text-secondary text-subtitle-12 uppercase leading-none">
                  Resolved
                </span>
              )}
              {anomaly.end === undefined &&
                props.hasTrackedContractsChanged && (
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
                        There are implementation changes, data might be
                        incorrect.
                      </>
                    }
                  />
                )}
              <AnomalyText anomaly={anomaly} />
            </div>
          )
        })}
      </div>
      {props.anomalies.length > 4 && (
        <div className="-mx-4 border-divider border-t px-4 pt-2">
          And {props.anomalies.length - SHOWN_ANOMALIES} more
        </div>
      )}
    </>
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
