import classNames from 'classnames'
import range from 'lodash/range'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  Anomaly,
  AnomalyEntry,
  AnomalyIndicatorEntry,
} from '../pages/scaling/liveness/types'
import { formatTimestamp } from '../utils'
import { LivenessDurationCell } from './table/LivenessDurationCell'

interface Props {
  anomalyEntries: AnomalyIndicatorEntry[]
  showComingSoon?: boolean
}

export function AnomalyIndicator({ anomalyEntries, showComingSoon }: Props) {
  if (showComingSoon) {
    return (
      <div className="w-min select-none text-center">
        <div className="mx-auto text-gray-500 dark:text-gray-50">
          Coming soon
        </div>
        <div className="flex gap-x-0.5">
          {range(30).map((_, i) => (
            <div key={i} className="h-0.5 w-0.5 rounded-full bg-neutral-700" />
          ))}
        </div>
      </div>
    )
  }

  if (anomalyEntries.length === 0) {
    return (
      <div className="w-min select-none text-center">
        <div className="mx-auto text-gray-500 dark:text-gray-50">No data</div>
        <div className="flex gap-x-0.5">
          {range(30).map((_, i) => (
            <div key={i} className="h-0.5 w-0.5 rounded-full bg-neutral-700" />
          ))}
        </div>
      </div>
    )
  }

  const data = anomalyEntries.filter(
    (anomaly) => anomaly.isAnomaly,
  ) as AnomalyEntry[]

  return (
    <span
      className="Tooltip flex h-6 w-min gap-x-0.5"
      title={renderToStaticMarkup(<AnomalyTooltip anomalyEntries={data} />)}
      data-tooltip-big={true}
      data-testid="anomaly-indicator"
    >
      {anomalyEntries.map((anomaly, i) => (
        <div
          key={i}
          className={classNames(
            'w-0.5 rounded-full',
            anomaly.isAnomaly ? 'bg-orange-400' : 'bg-blue-500',
          )}
        />
      ))}
    </span>
  )
}

function AnomalyTooltip(props: { anomalyEntries: AnomalyEntry[] }) {
  const anomalies = props.anomalyEntries
    .flatMap((anomalyEntry) => anomalyEntry.anomalies)
    .reverse()

  if (anomalies.length === 0) {
    return <div>No anomalies detected in the last 30 days</div>
  }

  return (
    <div>
      <span>Anomalies from last 30 days:</span>
      <ul className="mt-2.5 ml-4 list-disc space-y-4 text-gray-500 dark:text-gray-50">
        {anomalies.slice(0, 4).map((anomaly) => (
          <li key={anomaly.timestamp}>
            <span>
              {formatTimestamp(anomaly.timestamp, {
                withTime: true,
                longMonthName: true,
              })}
            </span>
            <div className="mt-2 text-black dark:text-white">
              <AnomalyTypeBadge type={anomaly.type} />
              <span className="ml-2.5">
                Duration:{' '}
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
    </div>
  )
}

function AnomalyTypeBadge(props: { type: Anomaly['type'] }) {
  return (
    <span className="w-max rounded bg-orange-400 px-1.5 py-0.5 text-black">
      {props.type}
    </span>
  )
}
