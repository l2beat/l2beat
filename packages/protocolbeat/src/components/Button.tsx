import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

export function Button({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'border border-coffee-400 px-4 py-1 font-medium text-sm transition-colors duration-100 hover:bg-coffee-400/50 disabled:opacity-50 disabled:hover:bg-transparent',
        props.className,
      )}
    >
      {children}
    </button>
  )
}
