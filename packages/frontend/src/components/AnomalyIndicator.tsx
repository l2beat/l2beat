import classNames from 'classnames'
import range from 'lodash/range'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { formatTimestamp } from '../utils'
import { DurationCell } from './table/DurationCell'

interface Props {
  anomalyEntries: AnomalyIndicatorEntry[]
}

export type AnomalyIndicatorEntry = AnomalyEntry | NonAnomalyEntry

interface Anomaly {
  type: 'BATCH SUBMISSION' | 'STATE UPDATE'
  timestamp: number
  durationInSeconds: number
}

interface AnomalyEntry {
  isAnomaly: true
  anomalies: Anomaly[]
}

interface NonAnomalyEntry {
  isAnomaly: false
}

export function AnomalyIndicator({ anomalyEntries }: Props) {
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

  const shouldShowTooltip = data.length > 0

  return (
    <span
      className={classNames(
        'flex h-6 w-min gap-x-0.5',
        shouldShowTooltip && 'Tooltip',
      )}
      title={
        shouldShowTooltip
          ? renderToStaticMarkup(<AnomalyTooltip anomalyEntries={data} />)
          : undefined
      }
      data-tooltip-big={shouldShowTooltip}
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
  return (
    <div>
      <span>Anomalies from last 30 days:</span>
      <ul className="mt-2.5 ml-4 list-disc space-y-4 text-gray-500 dark:text-gray-50">
        {props.anomalyEntries.map((anomalyEntry) =>
          anomalyEntry.anomalies.map((anomaly) => (
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
                  <DurationCell
                    durationInSeconds={anomaly.durationInSeconds}
                    withColors
                  />
                </span>
              </div>
            </li>
          )),
        )}
      </ul>
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
