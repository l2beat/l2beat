import classNames from 'classnames'
import React from 'react'

import { ScalingLivenessViewEntry } from '../../pages/scaling/liveness/types'
import { RoundedWarningIcon } from '../icons/symbols/RoundedWarningIcon'

export function LivenessDurationCell(props: {
  durationInSeconds: number | undefined
  project?: ScalingLivenessViewEntry
  tooltip?: string
  showOptimisticRollupWarning?: boolean
}) {
  if (
    !props.durationInSeconds &&
    props.project?.dataAvailabilityMode === 'TxData'
  ) {
    return (
      <div className="rounded bg-gray-200 px-1.5 py-px text-center font-medium text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
        Coming soon
      </div>
    )
  }

  if (!props.durationInSeconds)
    return (
      <div
        className={classNames(
          'rounded bg-gray-200 px-1.5 py-px text-center font-medium uppercase text-gray-500 dark:bg-neutral-700 dark:text-gray-50',
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
      <span className="text-orange-600 dark:text-orange-500">
        {days} {addPlural('day', days)}
      </span>
    ) : hours > 0 ? (
      <span className="text-yellow-700 dark:text-yellow-100">
        {hours} {addPlural('hour', hours)}
      </span>
    ) : minutes > 0 ? (
      <span>
        {minutes} {addPlural('minute', minutes)}
      </span>
    ) : (
      <span className="text-green-300 dark:text-green-450">
        {seconds} {addPlural('second', seconds)}
      </span>
    )

  return (
    <div
      className={classNames(
        'flex items-center gap-1.5',
        props.tooltip && 'Tooltip',
      )}
      title={props.tooltip}
    >
      {duration}
      {props.showOptimisticRollupWarning && (
        <div
          className="Tooltip"
          title="Please note, for Optimistic rollups the state is not finalized until the challenge period passes."
        >
          <RoundedWarningIcon className="h-5 w-5 fill-yellow-700 dark:fill-yellow-300" />
        </div>
      )}
    </div>
  )
}

function addPlural(s: string, n: number) {
  return n === 1 ? s : `${s}s`
}
