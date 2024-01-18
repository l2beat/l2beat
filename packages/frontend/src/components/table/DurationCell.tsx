import React from 'react'

import { pluralize } from '../../utils/pluralize'

export function DurationCell(props: { durationInSeconds: number }) {
  const seconds = props.durationInSeconds
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const duration =
    days > 0 ? (
      <span className="text-orange-600 dark:text-orange-500">
        {days} {pluralize(days, 'day') + ' + L1 Finality'}
      </span>
    ) : hours > 0 ? (
      <span className="text-yellow-700 dark:text-yellow-100">
        {hours} {pluralize(hours, 'hour') + ' + L1 Finality'}
      </span>
    ) : minutes > 0 ? (
      <span>
        {minutes} {pluralize(minutes, 'minute') + ' + L1 Finality'}
      </span>
    ) : (
      <span className="text-green-300 dark:text-green-450">
        {seconds} {pluralize(seconds, 'second') + ' + L1 Finality'}
      </span>
    )

  return duration
}
