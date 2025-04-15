import { RiskBanner } from '~/components/projects/risk-banner'
import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'

interface Props {
  values: RosetteValue[]
  className?: string
  descriptionAsTooltip?: boolean
  info?: 'compact' | 'full'
  size?: 'small' | 'regular'
}

export function GrissiniDetails({
  values,
  className,
  descriptionAsTooltip,
  info,
  size,
}: Props) {
  return (
    <div className={cn('flex w-[264px] flex-col gap-2 md:gap-4', className)}>
      {values.map((value) => (
        <RiskBanner
          key={value.name}
          {...value}
          descriptionAsTooltip={descriptionAsTooltip}
          size={size}
          info={info}
        />
      ))}
    </div>
  )
}
