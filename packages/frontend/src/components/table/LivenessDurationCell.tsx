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
import { DurationCell } from './DurationCell'

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
      <Tooltip>
        <TooltipTrigger className="rounded bg-gray-200 px-1.5 py-px text-center font-medium uppercase text-gray-500 dark:bg-neutral-700 dark:text-gray-50">
          n/a
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <DurationCell durationInSeconds={props.durationInSeconds} />
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
