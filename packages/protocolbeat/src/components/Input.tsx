import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      onKeyUp={(e) => {
        e.stopPropagation()
        props.onKeyUp?.(e)
      }}
      onKeyDown={(e) => {
        e.stopPropagation()
        props.onKeyDown?.(e)
      }}
      className={clsx(
        'border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function InputDescription({ children }: { children: React.ReactNode }) {
  return <p className="w-full text-right text-coffee-400 text-xs">{children}</p>
}
