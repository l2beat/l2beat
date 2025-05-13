import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

export function DialogInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      onKeyUp={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className={clsx(
        'border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none',
      )}
      {...props}
    />
  )
}
