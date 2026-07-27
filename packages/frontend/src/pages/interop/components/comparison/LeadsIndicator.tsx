import { TrendArrowIcon } from '~/icons/TrendArrow'
import { cn } from '~/utils/cn'
import type { ComparisonSide } from './types'

export function LeadsIndicator({
  side,
  align,
}: {
  side: ComparisonSide | undefined
  align: 'left' | 'right'
}) {
  if (!side) return <span />
  const { color, label } = side
  return (
    <span
      className={cn(
        'flex items-center gap-1 font-medium text-2xs',
        align === 'right' && 'justify-self-end',
      )}
      style={{ color }}
    >
      <TrendArrowIcon fill={color} />
      {label} leads
    </span>
  )
}
