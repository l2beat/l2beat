import cx from 'classnames'
import React, { ReactNode } from 'react'

import { CheckIcon } from './icons'

export interface CheckboxProps {
  className?: string
  label: ReactNode
  role: string
  id: string
  defaultChecked?: boolean
}

export function Checkbox({
  className,
  label,
  role,
  id,
  defaultChecked,
}: CheckboxProps) {
  return (
    <label
      className={cx(
        'bg-gray-200 text-base font-semibold dark:bg-gray-750',
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
      />
      <CheckIcon />
      <span>{label}</span>
    </label>
  )
}
