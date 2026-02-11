import { assertUnreachable, formatSeconds } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type {
  AverageDuration,
  SplitAverageDuration,
} from '~/server/features/scaling/interop/types'

export function AvgDurationCell({
  averageDuration,
  disableTooltip = false,
}: {
  averageDuration: AverageDuration
  disableTooltip?: boolean
}) {
  switch (averageDuration.type) {
    case 'unknown':
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge type="gray" size="small">
              Unknown
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            The transfer times for this protocol could not be derived based on
            onchain data only.
          </TooltipContent>
        </Tooltip>
      )
    case 'single':
      return (
        <div className="font-medium text-label-value-15">
          {formatSeconds(averageDuration.duration)}
        </div>
      )
    case 'split':
      return (
        <Tooltip>
          <TooltipTrigger disabled={disableTooltip}>
            <div className="flex flex-col items-end gap-0.5 font-medium text-label-value-15 md:gap-1.5">
              <DurationCellItem averageDuration={averageDuration} type="in" />
              <DurationCellItem averageDuration={averageDuration} type="out" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5 font-medium text-label-value-15">
              <DurationTooltipItem
                averageDuration={averageDuration}
                type="in"
              />
              <DurationTooltipItem
                averageDuration={averageDuration}
                type="out"
              />
            </div>
          </TooltipContent>
        </Tooltip>
      )
    default:
      assertUnreachable(averageDuration)
  }
}

function DurationCellItem({
  averageDuration,
  type,
}: {
  averageDuration: SplitAverageDuration
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
  averageDuration: SplitAverageDuration
  type: 'in' | 'out'
}) {
  const message = 'No transfers detected.'
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
