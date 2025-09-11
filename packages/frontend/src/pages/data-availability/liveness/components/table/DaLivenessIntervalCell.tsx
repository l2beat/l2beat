import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { WarningBar } from '~/components/WarningBar'
import { useIsClient } from '~/hooks/useIsClient'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { LivenessDurationCell } from '~/pages/scaling/liveness/components/LivenessDurationCell'
import { DurationCell } from '~/pages/scaling/liveness/components/table/DurationCell'
import { IntervalsHeader } from '~/pages/scaling/liveness/components/table/IntervalsHeader'
import type { LivenessDataPoint } from '~/server/features/scaling/liveness/types'
import type { DaLivenessBridgeTableEntry } from './toDaLivenessTableEntry'

export function DaLivenessIntervalCell({
  data,
  isSynced,
}: {
  data: DaLivenessBridgeTableEntry['data'] | undefined
  isSynced: boolean
}) {
  const isClient = useIsClient()

  if (!isClient) {
    return <Skeleton className="h-6 w-[100px]" />
  }

  const durationInSeconds = data?.averageInSeconds

  if (!data || durationInSeconds === undefined) {
    return <NotApplicableBadge />
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

function LivenessTooltip(props: { data: LivenessDataPoint }) {
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
