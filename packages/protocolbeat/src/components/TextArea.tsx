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
        'min-h-32 border border-coffee-400 bg-coffee-700 px-2 py-1 text-xs selection:bg-coffee-600 placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
