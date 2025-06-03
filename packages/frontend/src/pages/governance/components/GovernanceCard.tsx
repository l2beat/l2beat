import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import { cn } from '~/utils/cn'

type GovernanceCardProps = {
  children: React.ReactNode
  className?: string
  mobileFull?: boolean
} & VariantProps<typeof governanceCardVariants>

const governanceCardVariants = cva('rounded-lg', {
  variants: {
    type: {
      primary: 'bg-surface-primary',
      secondary: 'bg-surface-secondary',
      purple: 'bg-purple-100 text-white',
    },
    size: {
      default: 'p-8',
      medium: 'p-6',
    },
  },
  defaultVariants: {
    type: 'primary',
    size: 'default',
  },
})

export function GovernanceCard({
  children,
  className,
  type,
  size,
  mobileFull,
  ...rest
}: GovernanceCardProps) {
  return (
    <section
      className={cn(
        governanceCardVariants({ type, size }),
        mobileFull &&
          '-mx-4 rounded-none px-8 py-16 md:mx-0 md:rounded-lg md:p-8',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  )
}
