import { assertUnreachable } from '@l2beat/shared-pure'
import range from 'lodash/range'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { type LivenessAnomaly } from '~/server/features/scaling/liveness/types'
import {
  type AnomalyEntry,
  type AnomalyIndicatorEntry,
} from '~/server/features/scaling/liveness/utils/get-anomaly-entries'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { LivenessDurationCell } from './liveness-duration-cell'

interface Props {
  anomalyEntries: AnomalyIndicatorEntry[]
  showComingSoon?: boolean
}

export function AnomalyIndicator({ anomalyEntries, showComingSoon }: Props) {
  if (showComingSoon) {
    return (
      <div
        className="w-min select-none text-center"
        title="Anomalies coming soon"
      >
        <div className="mx-auto text-gray-500 dark:text-gray-50">
          Coming soon
        </div>
        <div className="flex gap-x-0.5">
          {range(30).map((_, i) => (
            <div key={i} className="size-0.5 rounded-full bg-neutral-700" />
          ))}
        </div>
      </div>
    )
  }

  if (anomalyEntries.length === 0) {
    return (
      <div
        className="w-min select-none text-center"
        title="No data for anomalies"
      >
        <div className="mx-auto text-gray-500 dark:text-gray-50">No data</div>
        <div className="flex gap-x-0.5">
          {range(30).map((_, i) => (
            <div key={i} className="size-0.5 rounded-full bg-neutral-700" />
          ))}
        </div>
      </div>
    )
  }

  const data = anomalyEntries.filter((anomaly) => anomaly.isAnomaly)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex h-6 w-min gap-x-0.5"
          title="Anomalies in the last 30 days"
        >
          {anomalyEntries.map((anomaly, i) => (
            <div
              key={i}
              className={cn(
                'w-0.5 rounded-full',
                anomaly.isAnomaly ? 'bg-orange-400' : 'bg-blue-500',
              )}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <AnomalyTooltipContent anomalyEntries={data} />
      </TooltipContent>
    </Tooltip>
  )
}

function AnomalyTooltipContent(props: { anomalyEntries: AnomalyEntry[] }) {
  const anomalies = props.anomalyEntries
    .flatMap((anomalyEntry) => anomalyEntry.anomalies)
    .reverse()

  if (anomalies.length === 0) {
    return <div>No anomalies detected in the last 30 days</div>
  }

  return (
    <>
      <span>Anomalies from last 30 days:</span>
      <ul className="ml-4 mt-2.5 list-disc space-y-4 text-gray-500 dark:text-gray-50">
        {anomalies.slice(0, 4).map((anomaly) => (
          <li key={anomaly.timestamp}>
            <span>
              {formatTimestamp(anomaly.timestamp, {
                mode: 'datetime',
                longMonthName: true,
              })}
            </span>
            <div className="text-primary mt-2">
              <AnomalyTypeBadge type={anomaly.type} />
              <span className="ml-2.5 inline-flex gap-1">
                Duration:
                <LivenessDurationCell
                  durationInSeconds={anomaly.durationInSeconds}
                />
              </span>
            </div>
          </li>
        ))}
      </ul>
      {anomalies.length > 4 && (
        <div className="mt-2.5">And {anomalies.length - 4} more</div>
      )}
    </>
  )
}

function AnomalyTypeBadge(props: {
  type: LivenessAnomaly['type']
}) {
  return (
    <span className="w-max rounded-sm bg-orange-400 px-1.5 py-0.5 text-black">
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
