import { UnixTime, pluralize } from '@l2beat/shared-pure'
import React from 'react'

export function DurationCell(props: { durationInSeconds: number }) {
  const seconds = props.durationInSeconds
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const durationText: string =
    days > 1
      ? `${days} ${pluralize(days, 'day')}`
      : hours > 0
        ? `${hours} ${pluralize(hours, 'hour')}`
        : minutes > 0
          ? `${minutes} ${pluralize(minutes, 'minute')}`
          : `${seconds} ${pluralize(seconds, 'second')}`

  const colorClassName = getDurationColorClassName(seconds)

  return <span className={colorClassName}>{durationText}</span>
}

function getDurationColorClassName(durationInSeconds: number) {
  if (durationInSeconds < UnixTime.MINUTE) {
    return 'text-green-300 dark:text-green-450'
  }
  if (durationInSeconds < UnixTime.HOUR) {
    return ''
  }
  if (durationInSeconds < UnixTime.DAY) {
    return 'text-yellow-700 dark:text-yellow-100'
  }
  return 'text-orange-600 dark:text-orange-500'
}
