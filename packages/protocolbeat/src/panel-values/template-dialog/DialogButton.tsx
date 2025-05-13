import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

export function DialogButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'border border-coffee-400 px-4 py-1 font-medium text-sm transition-colors hover:bg-coffee-500 disabled:opacity-50 disabled:hover:bg-transparent',
        props.className,
      )}
    >
      {children}
    </button>
  )
}
