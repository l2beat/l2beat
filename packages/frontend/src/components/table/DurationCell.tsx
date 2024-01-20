import { pluralize } from '@l2beat/shared-pure'
import React from 'react'

export function DurationCell(props: { durationInSeconds: number }) {
  const seconds = props.durationInSeconds
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const duration =
    days > 0 ? (
      <span className="text-orange-600 dark:text-orange-500">
        {days} {pluralize(days, 'day')}
      </span>
    ) : hours > 0 ? (
      <span className="text-yellow-700 dark:text-yellow-100">
        {hours} {pluralize(hours, 'hour')}
      </span>
    ) : minutes > 0 ? (
      <span>
        {minutes} {pluralize(minutes, 'minute')}
      </span>
    ) : (
      <span className="text-green-300 dark:text-green-450">
        {seconds} {pluralize(seconds, 'second')}
      </span>
    )

  return duration
}
