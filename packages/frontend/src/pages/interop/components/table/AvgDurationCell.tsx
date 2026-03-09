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
              {averageDuration.splits.map((split) => (
                <DurationCellItem key={split.label} split={split} />
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5 font-medium text-label-value-15">
              {averageDuration.splits.map((split) => (
                <DurationTooltipItem key={split.label} split={split} />
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )
    default:
      assertUnreachable(averageDuration)
  }
}

function DurationCellItem({
  split,
}: {
  split: SplitAverageDuration['splits'][number]
}) {
  return (
    <div className="flex items-center">
      <span className="text-[13px] text-secondary leading-none">
        {split.label}:{' '}
      </span>
      {split.duration !== null ? (
        formatSeconds(split.duration)
      ) : (
        <Badge type="gray" size="extraSmall">
          N/A
        </Badge>
      )}
    </div>
  )
}

function DurationTooltipItem({
  split,
}: {
  split: SplitAverageDuration['splits'][number]
}) {
  const message = 'No transfers detected.'
  return (
    <div>
      <span className="text-[13px] text-secondary leading-none">
        {split.label}:{' '}
      </span>
      {split.duration !== null ? formatSeconds(split.duration) : message}
    </div>
  )
}
