import { LivenessApiProject } from '@l2beat/shared-pure'
import React from 'react'

import { ScalingLivenessViewEntry } from '../../pages/scaling/liveness/types'
import { RoundedWarningIcon } from '../icons'
import { WarningBar } from '../project/WarningBar'
import {
  Tooltip,
  TooltipContent,
  TooltipContentType,
  TooltipTrigger,
} from '../tooltip/Tooltip'

export function LivenessDurationCell(props: {
  durationInSeconds: number | undefined
  dataType?: Exclude<keyof LivenessApiProject, 'anomalies'>
  project?: ScalingLivenessViewEntry
  tooltipContent?: TooltipContentType
  warning?: string
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
      <Tooltip className="rounded bg-gray-200 px-1.5 py-px text-center font-medium uppercase text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
        <TooltipTrigger>n/a</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    )
  }

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
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        {duration}
        {props.warning && (
          <RoundedWarningIcon className="h-5 w-5 fill-yellow-700 dark:fill-yellow-300" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {props.tooltipContent}
        {props.warning && (
          <WarningBar className="mt-2" text={props.warning} color="yellow" />
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function addPlural(s: string, n: number) {
  return n === 1 ? s : `${s}s`
}
