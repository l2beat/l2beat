import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'
import { RiskBanner } from '~/components/projects/risk-banner'

interface Props {
  values: RosetteValue[]
  className?: string
  descriptionAsTooltip?: boolean
  withoutDescription?: boolean
  size?: 'small' | 'regular'
}

export function GrissiniDetails({
  values,
  className,
  descriptionAsTooltip,
  size,
  withoutDescription,
}: Props) {
  return (
    <div className={cn('flex w-[264px] flex-col gap-2 md:gap-4', className)}>
      {values.map((value) => (
        <RiskBanner
          key={value.name}
          {...value}
          descriptionAsTooltip={descriptionAsTooltip}
          size={size}
          description={withoutDescription ? undefined : value.description}
        />
      ))}
    </div>
  )
}
