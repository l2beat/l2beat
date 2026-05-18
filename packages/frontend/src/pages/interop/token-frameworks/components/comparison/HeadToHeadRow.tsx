import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'
import { compareMetric } from './compareMetric'
import { LeadsIndicator } from './LeadsIndicator'
import type { Side } from './types'

export function HeadToHeadRow({
  label,
  left,
  right,
  leftValue,
  rightValue,
  format,
  lowerIsBetter,
  isLoading,
}: {
  label: string
  left: Side | undefined
  right: Side | undefined
  leftValue: number | null
  rightValue: number | null
  format: (v: number) => string
  lowerIsBetter?: boolean
  isLoading: boolean
}) {
  const { leader, leftFill, rightFill } = compareMetric(
    leftValue,
    rightValue,
    lowerIsBetter,
  )

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-3 items-baseline gap-3">
        <span
          className={cn('font-bold text-heading-16', !left && 'text-secondary')}
          style={{ color: left?.framework.color }}
        >
          {leftValue ? format(leftValue) : '—'}
        </span>
        <span className="text-center font-semibold text-base text-secondary leading-none">
          {label}
        </span>
        <span
          className={cn(
            'text-right font-bold text-heading-16',
            !right && 'text-secondary',
          )}
          style={{ color: right?.framework.color }}
        >
          {rightValue ? format(rightValue) : '—'}
        </span>
      </div>

      {isLoading ? (
        <Skeleton className="h-1.5 w-full" />
      ) : (
        <CompareBar
          leftFill={leftFill}
          rightFill={rightFill}
          leftColor={left?.framework.color}
          rightColor={right?.framework.color}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <LeadsIndicator
          side={leader === 'left' ? left : undefined}
          align="left"
        />
        <LeadsIndicator
          side={leader === 'right' ? right : undefined}
          align="right"
        />
      </div>
    </div>
  )
}

function CompareBar({
  leftFill,
  rightFill,
  leftColor,
  rightColor,
}: {
  leftFill: number
  rightFill: number
  leftColor: string | undefined
  rightColor: string | undefined
}) {
  return (
    <div className="flex h-1.5 w-full items-center gap-0.5">
      <div className="flex h-full flex-1 justify-end overflow-hidden rounded-l-full bg-surface-secondary">
        <div
          className="h-full rounded-l-full"
          style={{ width: `${leftFill * 100}%`, backgroundColor: leftColor }}
        />
      </div>
      <div className="flex h-full flex-1 overflow-hidden rounded-r-full bg-surface-secondary">
        <div
          className="h-full rounded-r-full"
          style={{ width: `${rightFill * 100}%`, backgroundColor: rightColor }}
        />
      </div>
    </div>
  )
}
