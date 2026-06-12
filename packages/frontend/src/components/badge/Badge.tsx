import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
  children: ReactNode
}

const badgeVariants = cva('inline rounded text-center font-medium', {
  variants: {
    type: {
      error: 'bg-negative/20 text-negative',
      gray: 'border border-[#CCDBFF] bg-[#D5E5F1] font-medium text-secondary dark:border-[#1B3C54] dark:bg-[#192E3C]',
      warning: 'bg-yellow-500 text-black',
      brightYellow: 'bg-yellow-200 text-purple-700',
      pink: 'bg-pink-900 text-white',
      purple: 'bg-purple-100',
      blue: 'border border-n-sky-500 bg-n-sky-500/20 text-n-sky-500 dark:border-n-sky-300 dark:bg-n-sky-300/20 dark:text-n-sky-300',
      green: 'border border-positive bg-positive/20 text-positive',
    },
    size: {
      extraSmall: 'text-3xs',
      small: 'text-xs',
      regular: 'text-2xs md:text-xs',
    },
    padding: {
      small: 'px-1.5 py-px',
      regular: 'px-1.5 py-1',
    },
  },
  defaultVariants: {
    size: 'regular',
    padding: 'small',
  },
})

export function Badge({
  className,
  children,
  type,
  size,
  padding,
  ...rest
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({
          type: type,
          size: size,
          padding: padding,
        }),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
