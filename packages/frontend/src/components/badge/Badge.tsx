import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

interface BadgeProps extends VariantProps<typeof badgeVariants> {
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

export function Badge(props: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({
          type: props.type,
          size: props.size,
          padding: props.padding,
        }),
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
