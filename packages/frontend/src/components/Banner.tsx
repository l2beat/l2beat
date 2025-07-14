import { type VariantProps, cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { InfoIcon } from '~/icons/Info'

const bannerVariants = cva(
  'flex gap-2 rounded-lg border px-6 py-2 text-label-value-13',
  {
    variants: {
      type: {
        info: 'border-link bg-link/20 text-link',
        warning: 'border-yellow-700 bg-yellow-200 text-yellow-900',
        negative: 'border-negative bg-negative/20 text-negative',
        neutral: 'border-divider bg-surface-secondary text-secondary',
      },
    },
  },
)

interface Props extends VariantProps<typeof bannerVariants> {
  children: ReactNode
}

export function Banner({ children, type }: Props) {
  return (
    <div className={bannerVariants({ type })}>
      <InfoIcon className="size-3 shrink-0 fill-current" />
      <div>{children}</div>
    </div>
  )
}
