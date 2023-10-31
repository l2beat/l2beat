import classNames from 'classnames'
import range from 'lodash/range'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { formatTimestamp } from '../utils'

interface Props {
  anomalies: AnomalyIndicatorEntry[]
}

type AnomalyIndicatorEntry = AnomalyEntry | NonAnomalyEntry

interface AnomalyEntry {
  isAnomaly: true
  timestamp: number
  durationInSeconds: number
}

interface NonAnomalyEntry {
  isAnomaly: false
}

export function AnomalyIndicator({ anomalies }: Props) {
  if (anomalies.length === 0) {
    return (
      <div className="w-min select-none text-center">
        <div className="mx-auto text-gray-500 dark:text-gray-50">No data</div>
        <div className="flex h-6 gap-x-0.5">
          {range(30).map(() => (
            <div className="h-0.5 w-0.5 rounded-full bg-neutral-700" />
          ))}
        </div>
      </div>
    )
  }
  const data = anomalies.filter(
    (anomaly) => anomaly.isAnomaly,
  ) as AnomalyEntry[]

  const shouldShowTooltip = data.length > 0

  return (
    <span
      className={classNames(
        'flex h-6 w-min gap-x-0.5',
        shouldShowTooltip && 'Tooltip',
      )}
      title={
        shouldShowTooltip
          ? renderToStaticMarkup(<AnomalyTooltip anomalies={data} />)
          : undefined
      }
      data-testid="anomaly-indicator"
    >
      {anomalies.map((anomaly) => (
        <div
          className={classNames(
            'w-0.5 rounded-full',
            anomaly.isAnomaly ? 'bg-orange-400' : 'bg-blue-500',
          )}
        />
      ))}
    </span>
  )
}

function AnomalyTooltip(props: { anomalies: AnomalyEntry[] }) {
  return (
    <div>
      <span>Anomalies from last 30 days:</span>
      <ul className="mt-2.5 ml-4 list-disc space-y-4 text-gray-500 dark:text-gray-50">
        {props.anomalies.map((anomaly) => (
          <li>
            <span>
              {formatTimestamp(anomaly.timestamp, {
                withTime: true,
                longMonthName: true,
              })}
            </span>
            <DurationRow durationInSeconds={anomaly.durationInSeconds} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function DurationRow(props: { durationInSeconds: number }) {
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const duration =
    days > 0 ? (
      <span className="text-orange-600 dark:text-orange-500">{days} days</span>
    ) : hours > 0 ? (
      <span className="text-yellow-700 dark:text-yellow-100">
        {hours} hours
      </span>
    ) : (
      <span className="text-green-300 dark:text-green-450">
        {minutes} minutes
      </span>
    )

  return <div className="text-black dark:text-white">Duration: {duration}</div>
}
