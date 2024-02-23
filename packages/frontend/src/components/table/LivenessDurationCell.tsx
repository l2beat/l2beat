import { LivenessApiProject } from '@l2beat/shared-pure'
import React from 'react'

import { ScalingLivenessViewEntry } from '../../pages/scaling/liveness/types'
import { Badge } from '../badge/Badge'
import { UpcomingBadge } from '../badge/UpcomingBadge'
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
    return <UpcomingBadge />
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
        <TooltipTrigger>
          <Badge type="gray" className="uppercase">
            n/a
          </Badge>
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
          <RoundedWarningIcon className="size-5 fill-yellow-700 dark:fill-yellow-300" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {props.tooltipContent}
        {props.warning && (
          <WarningBar
            className="mt-2"
            icon={RoundedWarningIcon}
            text={props.warning}
            color="yellow"
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
