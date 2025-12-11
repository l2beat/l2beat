import clsx from 'clsx'
import type { TextareaHTMLAttributes } from 'react'

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
      className={clsx(
        'border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
