import { cva, type VariantProps } from 'class-variance-authority'

const riskDotVariants = cva('rounded-full', {
  variants: {
    risk: {
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

export function TrustedSetupRiskDot({
  risk,
  size,
  className,
}: VariantProps<typeof riskDotVariants> & { className?: string }) {
  return <div className={riskDotVariants({ risk, size, className })} />
}
