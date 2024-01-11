import { LivenessApiProject } from '@l2beat/shared-pure'
import classNames from 'classnames'
import React from 'react'

import { ScalingLivenessViewEntry } from '../../pages/scaling/liveness/types'
import { pluralize } from '../../utils/pluralize'

export function LivenessDurationCell(props: {
  durationInSeconds: number | undefined
  dataType?: Exclude<keyof LivenessApiProject, 'anomalies'>
  project?: ScalingLivenessViewEntry
  tooltip?: string
}) {
  if (
    !props.durationInSeconds &&
    props.project?.category === 'ZK Rollup' &&
    props.dataType === 'proofSubmissions'
  ) {
    return (
      <div className="rounded bg-gray-200 px-1.5 py-px text-center font-medium text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
        Coming soon
      </div>
    )
  }

  if (!props.durationInSeconds) {
    const tooltipText =
      props.dataType === 'batchSubmissions' &&
      props.project?.dataAvailabilityMode === 'StateDiffs'
        ? 'State diff rollups do not post batches of transactions to the L1.'
        : props.dataType === 'proofSubmissions' &&
          props.project?.category === 'Optimistic Rollup'
        ? 'Optimistic rollups do not post validity proofs to the L1.'
        : undefined
    return (
      <div
        className={
          'Tooltip rounded bg-gray-200 px-1.5 py-px text-center font-medium uppercase text-gray-500 dark:bg-neutral-700 dark:text-gray-50'
        }
        title={tooltipText}
      >
        n/a
      </div>
    )
  }

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

  return (
    <span
      className={classNames(props.tooltip && 'Tooltip')}
      title={props.tooltip}
      data-tooltip-big={true}
    >
      {duration}
    </span>
  )
}
