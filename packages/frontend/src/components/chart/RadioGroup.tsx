import React from 'react'

import { cn } from '../../utils/cn'

export interface RadioGroupProps {
  role: string
  name: string
  className?: string
  optionsClassname?: string
  options: {
    value: string
    checked?: boolean
    className?: string
  }[]
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <div
      data-role={props.role}
      className={cn(
        'bg-gray-200 text-base font-medium dark:bg-zinc-700',
        'inline-flex items-center gap-1 rounded-lg p-1',
        props.className,
      )}
    >
      {props.options.map((option, i) => (
        <label
          key={i}
          className={cn(
            'relative block select-none',
            props.optionsClassname,
            option.className,
          )}
        >
          <input
            className="peer absolute left-0 top-0 block size-full cursor-pointer opacity-0"
            defaultChecked={option.checked}
            autoComplete="off"
            type="radio"
            name={props.name}
            value={option.value}
          />
          <span
            className={cn(
              'relative block px-2',
              'cursor-pointer rounded-md peer-checked:bg-white peer-disabled:cursor-not-allowed peer-disabled:!bg-transparent peer-disabled:opacity-60 dark:peer-checked:bg-black',
              'outline-current peer-focus-visible:outline peer-focus-visible:outline-2',
            )}
          >
            {option.value}
          </span>
        </label>
      ))}
    </div>
  )
}
