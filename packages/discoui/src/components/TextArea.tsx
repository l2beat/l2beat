import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      onKeyDown={(e) => {
        e.stopPropagation()
        props.onKeyDown?.(e)
      }}
      onKeyUp={(e) => {
        e.stopPropagation()
        props.onKeyUp?.(e)
      }}
      className={cn(
        'min-h-20 rounded-sm border border-coffee-600 bg-coffee-800 px-2.5 py-1.5 text-coffee-100 text-xs selection:bg-coffee-600 placeholder:text-coffee-400 focus:border-autumn-300 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
