import { LivenessApiProject } from '@l2beat/shared-pure'
import React from 'react'

import { ScalingLivenessViewEntry } from '../../pages/scaling/liveness/types'
import { SyncStatus } from '../../pages/types'
import { Badge } from '../badge/Badge'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { RoundedWarningIcon } from '../icons'
import {
  Tooltip,
  TooltipContent,
  TooltipContentType,
  TooltipTrigger,
} from '../tooltip/Tooltip'
import { WarningBar } from '../WarningBar'
import { DurationCell } from './DurationCell'
import { GrayedOut } from './GrayedOut'

export function LivenessDurationCell(props: {
  durationInSeconds: number | undefined
  dataType?: Exclude<keyof LivenessApiProject, 'anomalies'>
  project?: ScalingLivenessViewEntry
  tooltipContent?: TooltipContentType
  warning?: string
  syncStatus?: SyncStatus
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
      (props.project?.dataAvailabilityMode === 'State diffs' ||
        props.project?.dataAvailabilityMode === 'State diffs (compressed)')
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
        <GrayedOut grayOut={props.syncStatus?.isSynced === false}>
          <DurationCell durationInSeconds={props.durationInSeconds} />
        </GrayedOut>
        {props.warning && (
          <RoundedWarningIcon className="size-5" sentiment="warning" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {!props.syncStatus?.isSynced &&
          props.syncStatus?.displaySyncedUntil && (
            <>
              <span className="whitespace-pre text-balance font-medium">
                {props.syncStatus.displaySyncedUntil}
              </span>
              <HorizontalSeparator className="my-2 dark:border-slate-600" />
            </>
          )}
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
