import { type VariantProps, cva } from 'class-variance-authority'
import { type ReactNode } from 'react'
import { cn } from '~/utils/cn'

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
  children: ReactNode
}

const badgeVariants = cva('rounded text-center font-medium', {
  variants: {
    type: {
      error: 'bg-red-500 text-white',
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
