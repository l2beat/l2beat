import { formatSeconds } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type {
  DurationSplit,
  LockAndMintProtocolEntry,
} from '~/server/features/scaling/interop/utils/getProtocolsByType'

export function AvgDurationCell({
  averageDuration,
}: {
  averageDuration: LockAndMintProtocolEntry['averageDuration']
}) {
  if (averageDuration.type === 'single') {
    return (
      <div className="font-medium text-label-value-15">
        {formatSeconds(averageDuration.duration)}
      </div>
    )
  }
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex flex-col items-start gap-0.5 font-medium text-label-value-15">
          <DurationCellItem averageDuration={averageDuration} type="in" />
          <DurationCellItem averageDuration={averageDuration} type="out" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1.5 font-medium text-label-value-15">
          <DurationTooltipItem averageDuration={averageDuration} type="in" />
          <DurationTooltipItem averageDuration={averageDuration} type="out" />
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function DurationCellItem({
  averageDuration,
  type,
}: {
  averageDuration: DurationSplit
  type: 'in' | 'out'
}) {
  return (
    <div className="flex items-center">
      <span className="text-[13px] text-secondary capitalize leading-none">
        {type}:{' '}
      </span>
      {averageDuration[type].duration ? (
        formatSeconds(averageDuration[type].duration)
      ) : (
        <Badge type="gray" size="extraSmall">
          N/A
        </Badge>
      )}
    </div>
  )
}

function DurationTooltipItem({
  averageDuration,
  type,
}: {
  averageDuration: DurationSplit
  type: 'in' | 'out'
}) {
  const message =
    'No transfers detected. Reset selection to include all transfers.'
  return (
    <div>
      <span className="text-[13px] text-secondary leading-none">
        {averageDuration[type].label}:{' '}
      </span>
      {averageDuration[type].duration
        ? formatSeconds(averageDuration[type].duration)
        : message}
    </div>
  )
}
