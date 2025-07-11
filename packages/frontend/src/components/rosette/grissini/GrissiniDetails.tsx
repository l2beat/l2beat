import { RiskBanner } from '~/components/projects/RiskBanner'
import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'

interface Props {
  values: RosetteValue[]
  className?: string
  descriptionAsTooltip?: boolean
  info?: 'compact' | 'full'
}

export function GrissiniDetails({
  values,
  className,
  descriptionAsTooltip,
  info,
}: Props) {
  return (
    <div className={cn('flex w-[264px] flex-col gap-3', className)}>
      {values.map((value) => (
        <RiskBanner
          key={value.name}
          {...value}
          descriptionAsTooltip={descriptionAsTooltip}
          info={info}
        />
      ))}
    </div>
  )
}
