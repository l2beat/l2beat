import classNames from 'classnames'
import React from 'react'

import { ScalingLivenessViewEntry } from '../../pages/scaling/liveness/types'

export function DurationCell(props: {
  durationInSeconds: number | undefined
  withColors?: boolean
  project?: ScalingLivenessViewEntry
}) {
  if (
    !props.durationInSeconds &&
    props.project?.dataAvailabilityMode === 'TxData'
  ) {
    return (
      <div className="w-full rounded bg-gray-200 px-1.5 py-px text-center font-medium text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
        Coming soon
      </div>
    )
  }

  if (!props.durationInSeconds)
    return (
      <div
        className={classNames(
          'w-full rounded bg-gray-200 px-1.5 py-px text-center font-medium text-gray-500 dark:bg-neutral-700 dark:text-gray-50',
          props.project?.dataAvailabilityMode === 'StateDiffs' && 'Tooltip',
        )}
        title="State diff rollups do not post batches of transactions to the L1."
      >
        n/a
      </div>
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
