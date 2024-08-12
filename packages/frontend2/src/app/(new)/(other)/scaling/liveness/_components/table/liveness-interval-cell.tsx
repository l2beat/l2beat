import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '~/app/_components/tooltip/tooltip'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { WarningBar } from '~/app/_components/warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { DurationCell } from '../../../finality/_components/table/duration-cell'
import { type ScalingLivenessTableEntry } from './to-table-entry'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { formatTimestamp } from '~/utils/dates'
import { Badge } from '~/app/_components/badge/badge'
import {
  type LivenessDataPoint,
  type TrackedTxsConfigSubtype,
} from '@l2beat/shared-pure'
import { LivenessDurationCell } from '../liveness-duration-cell'

export function LivenessIntervalCell(props: {
  entry: ScalingLivenessTableEntry
  dataType: TrackedTxsConfigSubtype
}) {
  const data = props.entry.data?.[props.dataType]
  const durationInSeconds = data?.averageInSeconds
  const syncStatus = props.entry.data?.syncStatus

  if (!durationInSeconds) {
    const tooltipText = getNonApplicableTooltipText(props.dataType, props.entry)

    if (!tooltipText) {
      return <Badge type="gray">N/A</Badge>
    }

    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge type="gray">N/A</Badge>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <SyncStatusWrapper syncStatus={syncStatus}>
          <DurationCell durationInSeconds={durationInSeconds} />
        </SyncStatusWrapper>
        {data.warning && (
          <RoundedWarningIcon className="size-5" sentiment="warning" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {syncStatus && !syncStatus.isSynced && (
          <>
            <span className="whitespace-pre text-balance font-medium">
              {formatTimestamp(syncStatus.syncedUntil, {
                mode: 'datetime',
                longMonthName: true,
              })}
            </span>
            <HorizontalSeparator className="my-2 dark:border-slate-600" />
          </>
        )}
        {<LivenessTooltip data={data} />}
        {data.warning && (
          <WarningBar
            className="mt-2"
            icon={RoundedWarningIcon}
            text={data.warning}
            color="yellow"
            ignoreMarkdown
          />
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function LivenessTooltip(props: {
  data: LivenessDataPoint | undefined
}) {
  // TODO: Fix this
  if (!props.data) {
    throw new Error('Data is undefined')
  }
  return (
    <div className="font-medium">
      <span>30-day intervals:</span>
      <ul className="mt-1 list-inside list-disc">
        <li className="flex justify-between gap-4">
          Minimum:
          <LivenessDurationCell
            durationInSeconds={props.data.minimumInSeconds}
          />
        </li>
        <li className="flex justify-between gap-4">
          Average:
          <LivenessDurationCell
            durationInSeconds={props.data.averageInSeconds}
          />
        </li>
        <li className="flex justify-between gap-4">
          Maximum:
          <LivenessDurationCell
            durationInSeconds={props.data.maximumInSeconds}
          />
        </li>
      </ul>
    </div>
  )
}

function getNonApplicableTooltipText(
  dataType: TrackedTxsConfigSubtype,
  project: ScalingLivenessTableEntry,
) {
  if (
    dataType === 'batchSubmissions' &&
    (project?.dataAvailabilityMode === 'State diffs' ||
      project?.dataAvailabilityMode === 'State diffs (compressed)')
  ) {
    return 'State diff rollups do not post batches of transactions to the L1.'
  }

  if (
    dataType === 'proofSubmissions' &&
    project?.category === 'Optimistic Rollup'
  ) {
    return 'Optimistic rollups do not post validity proofs to the L1.'
  }

  return undefined
}
