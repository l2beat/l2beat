import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'
import { CheckIcon } from './icons'

export interface CheckboxProps {
  className?: string
  checkIconClassName?: string
  label: ReactNode
  role: string
  id: string
  defaultChecked?: boolean
}

export function Checkbox({
  className,
  checkIconClassName,
  label,
  role,
  id,
  defaultChecked,
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'bg-gray-200 text-base font-semibold dark:bg-zinc-700',
        'inline-flex cursor-pointer select-none items-center gap-2 rounded-lg py-1 pl-2 pr-3',
        className,
      )}
    >
      <input
        data-role={role}
        id={id}
        type="checkbox"
        autoComplete="off"
        className="peer hidden"
        defaultChecked={defaultChecked}
        {...rest}
      />
      <CheckIcon className={cn('shrink-0', checkIconClassName)} />
      <span className="whitespace-pre">{label}</span>
    </label>
  )
}
