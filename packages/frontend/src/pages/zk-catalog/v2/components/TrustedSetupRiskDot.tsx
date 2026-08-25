import type { TrustedSetup } from '@l2beat/config'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleWithSlashIcon } from '~/icons/CircleWithSlash'
import { CircleWithStarIcon } from '~/icons/CircleWithStar'

const riskDotVariants = cva('rounded-full', {
  variants: {
    risk: {
      'N/A': 'fill-positive',
      None: 'fill-secondary',
      green: 'bg-positive',
      yellow: 'bg-surface-warning',
      red: 'bg-negative',
    },
    size: {
      sm: 'size-5',
      md: 'size-6',
      lg: 'size-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

/** 'None' is a privacy-only placeholder for projects without a ZK system. */
export type TrustedSetupRisk = TrustedSetup['risk'] | 'None'

export type TrustedSetupRiskDotSize = VariantProps<
  typeof riskDotVariants
>['size']

export function TrustedSetupRiskDot({
  risk,
  size,
  className,
}: VariantProps<typeof riskDotVariants> & { className?: string }) {
  if (risk === 'N/A')
    return (
      <CircleWithStarIcon
        className={riskDotVariants({ risk, size, className })}
      />
    )

  if (risk === 'None')
    return (
      <CircleWithSlashIcon
        className={riskDotVariants({ risk, size, className })}
      />
    )

  return <div className={riskDotVariants({ risk, size, className })} />
}
