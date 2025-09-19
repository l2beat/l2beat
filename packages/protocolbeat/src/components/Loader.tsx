import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

export function Loader({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        'size-4 animate-spin rounded-full border-2 border-coffee-400 border-t-transparent',
        props.className,
      )}
    >
      {children}
    </div>
  )
}
