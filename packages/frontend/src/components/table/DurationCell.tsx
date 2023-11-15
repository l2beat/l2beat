import classNames from 'classnames'
import React from 'react'

export function DurationCell(props: {
  durationInSeconds: number | undefined
  withColors?: boolean
  showComingSoon?: boolean
}) {
  if (props.showComingSoon) {
    return (
      <span className="rounded bg-gray-200 px-1.5 py-px text-center font-medium text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
        COMING SOON
      </span>
    )
  }
  if (props.durationInSeconds === undefined)
    return (
      <span className="rounded bg-gray-200 px-1.5 py-px text-center font-medium text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
        NO DATA
      </span>
    )
  const seconds = props.durationInSeconds
  const minutes = Math.floor(props.durationInSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const duration =
    days > 0 ? (
      <span
        className={classNames(
          props.withColors && 'text-orange-600 dark:text-orange-500',
        )}
      >
        {days} {addPlural('day', days)}
      </span>
    ) : hours > 0 ? (
      <span
        className={classNames(
          props.withColors && 'text-yellow-700 dark:text-yellow-100',
        )}
      >
        {hours} {addPlural('hour', hours)}
      </span>
    ) : minutes > 0 ? (
      <span
        className={classNames(
          props.withColors && 'text-green-300 dark:text-green-450',
        )}
      >
        {minutes} {addPlural('minute', minutes)}
      </span>
    ) : (
      <span
        className={classNames(
          props.withColors && 'text-green-300 dark:text-green-450',
        )}
      >
        {seconds} {addPlural('second', seconds)}
      </span>
    )

  return duration
}

function addPlural(s: string, n: number) {
  return n === 1 ? s : `${s}s`
}
