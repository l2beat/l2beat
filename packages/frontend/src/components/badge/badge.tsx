import { type VariantProps, cva } from 'class-variance-authority'
import { type ReactNode } from 'react'

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
  children: ReactNode
}

const badgeVariants = cva(
  'rounded px-1.5 py-1 text-center font-medium !leading-none',
  {
    variants: {
      type: {
        error: 'bg-negative/20 text-negative',
        gray: 'bg-gray-200 font-medium text-gray-700 sidebar:!bg-surface-tertiary sidebar:!text-secondary dark:bg-zinc-700 dark:text-gray-50',
        warning: 'bg-yellow-500 text-black',
        brightYellow: 'bg-yellow-200 text-purple-700',
        pink: 'bg-pink-900 text-white',
        purple: 'bg-purple-100',
      },
      size: {
        extraSmall: 'text-3xs',
        small: 'text-xs',
        regular: 'text-2xs md:text-xs',
      },
    },
    defaultVariants: {
      size: 'regular',
    },
  },
)

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <div
      className={badgeVariants({
        ...props,
        className,
      })}
    >
      {children}
    </div>
  )
}
