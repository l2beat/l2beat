import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/badge'
import { Skeleton } from '~/components/core/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { WarningBar } from '~/components/warning-bar'
import { useIsClient } from '~/hooks/use-is-client'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import type { LivenessDataPoint } from '~/server/features/scaling/liveness/types'
import { DurationCell } from '../../../finality/_components/table/duration-cell'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { LivenessDurationCell } from '../liveness-duration-cell'
import { IntervalsHeader } from './intervals-header'
import type { ScalingLivenessTableEntry } from './to-table-entry'

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
  const isSynced = props.entry.data?.isSynced

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
        <SyncStatusWrapper isSynced={isSynced}>
          <DurationCell durationInSeconds={durationInSeconds} />
        </SyncStatusWrapper>
        {data.warning && (
          <RoundedWarningIcon className="size-5" sentiment="warning" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        <LivenessTooltip data={data} />
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
    project?.dataAvailabilityMode?.value === 'State diffs'
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
