import { type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { Badge } from '~/app/_components/badge/badge'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { Skeleton } from '~/app/_components/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { WarningBar } from '~/app/_components/warning-bar'
import { useIsClient } from '~/hooks/use-is-client'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { type LivenessDataPoint } from '~/server/features/scaling/liveness/types'
import { formatTimestamp } from '~/utils/dates'
import { DurationCell } from '../../../finality/_components/table/duration-cell'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { LivenessDurationCell } from '../liveness-duration-cell'
import { IntervalsHeader } from './intervals-header'
import { type ScalingLivenessTableEntry } from './to-table-entry'

export function LivenessIntervalCell(props: {
  entry: ScalingLivenessTableEntry
  dataType: TrackedTxsConfigSubtype
}) {
  const isClient = useIsClient()

  if (!isClient) {
    return <Skeleton className="h-6 w-[100px]" />
  }

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
              Values have not been synced since{'\n'}
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
  data: LivenessDataPoint
}) {
  return (
    <div className="font-medium">
      <IntervalsHeader />
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
