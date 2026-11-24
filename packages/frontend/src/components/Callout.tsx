import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

const calloutVariants = cva('flex items-start rounded-lg', {
  variants: {
    color: {
      red: 'bg-negative/20',
      green: 'bg-positive/20',
      yellow: 'bg-yellow-700/20',
      blue: 'bg-blue-700/20',
      gray: 'bg-gray-500/20',
      purple: 'bg-purple-500/20',
    },
    small: {
      true: 'gap-2 rounded text-sm',
      false: 'gap-3',
    },
    /** Inside a tooltip: one size for every callout there. */
    compact: {
      true: 'gap-2 rounded-md px-3 py-2',
      false: '',
    },
  },
  defaultVariants: {
    small: false,
    compact: false,
  },
})

interface CalloutProps extends VariantProps<typeof calloutVariants> {
  icon: ReactNode
  body: ReactNode
  message?: ReactNode
  className?: string
}

export function Callout({
  color,
  small,
  compact,
  icon,
  body,
  message,
  className,
}: CalloutProps) {
  return (
    <div className={cn(calloutVariants({ color, small, compact }), className)}>
      {/* A compact callout centres its icon on the first line of text. */}
      <span className={cn('flex items-center', compact && 'h-[1lh] shrink-0')}>
        {icon}
      </span>
      <div className="flex flex-col gap-2">
        {message}
        <div>{body}</div>
      </div>
    </div>
  )
}
