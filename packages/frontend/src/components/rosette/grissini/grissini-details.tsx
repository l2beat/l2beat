import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'
import { SingleGrissiniDetails } from './single-grissini-details'

export function GrissiniDetails({
  values,
  className,
  showTooltip,
}: {
  values: RosetteValue[]
  className?: string
  showTooltip?: boolean
}) {
  return (
    <div className={cn('flex w-[264px] flex-col gap-4', className)}>
      {values.map((value) => (
        <SingleGrissiniDetails
          key={value.name}
          {...value}
          showTooltip={showTooltip}
        />
      ))}
    </div>
  )
}
