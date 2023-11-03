import React from 'react'

export function DurationCell(props: { durationInSeconds: number | undefined }) {
  if (props.durationInSeconds === undefined)
    return (
      <span className="rounded bg-neutral-700 px-1.5 py-px text-center font-medium text-gray-50">
        NO DATA
      </span>
    )

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

  return duration
}
