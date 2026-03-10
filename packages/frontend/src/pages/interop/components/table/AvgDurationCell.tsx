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
import { cn } from '~/utils/cn'

export function AvgDurationCell({
  averageDuration,
  className,
  splitClassName,
}: {
  averageDuration: AverageDuration
  className?: string
  splitClassName?: string
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
        <div className={cn('font-medium text-label-value-15', className)}>
          {formatSeconds(averageDuration.duration)}
        </div>
      )
    case 'split':
      return (
        <div
          className={cn(
            'flex flex-col items-end gap-0.5 font-medium text-label-value-15 md:gap-1.5',
            splitClassName,
          )}
        >
          {averageDuration.splits.map((split) => (
            <DurationCellItem key={split.label} split={split} />
          ))}
        </div>
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
    <div className="flex items-baseline">
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
