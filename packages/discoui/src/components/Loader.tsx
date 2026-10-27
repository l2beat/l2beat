import type { HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function Loader({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'size-4 animate-spin rounded-full border-2 border-coffee-400 border-t-transparent',
        props.className,
      )}
    >
      {children}
    </div>
  )
}
