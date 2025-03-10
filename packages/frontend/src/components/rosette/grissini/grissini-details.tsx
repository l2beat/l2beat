import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'
import { SingleGrissiniDetails } from './single-grissini-details'

export function GrissiniDetails({
  values,
  className,
  showTooltip,
  size,
}: {
  values: RosetteValue[]
  className?: string
  showTooltip?: boolean
  size?: 'small' | 'regular'
}) {
  return (
    <div className={cn('flex w-[264px] flex-col gap-2 md:gap-4', className)}>
      {values.map((value) => (
        <SingleGrissiniDetails
          key={value.name}
          {...value}
          showTooltip={showTooltip}
          size={size}
        />
      ))}
    </div>
  )
}
