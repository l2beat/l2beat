import React from 'react'

import { cn } from '../../utils/cn'

export interface RadioGroupProps {
  role: string
  name: string
  highlighted?: boolean
  className?: string
  optionsClassname?: string
  options: RadioGroupOption[]
}

export interface RadioGroupOption {
  value: string
  label?: string
  checked?: boolean
  className?: string
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <div
      data-role={props.role}
      className={cn(
        'bg-gray-200 font-medium text-base dark:bg-zinc-700',
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
            className="peer absolute top-0 left-0 block size-full cursor-pointer opacity-0"
            defaultChecked={option.checked}
            autoComplete="off"
            type="radio"
            name={props.name}
            value={option.value}
          />
          <span
            className={cn(
              'relative block px-2',
              'peer-disabled:!bg-transparent cursor-pointer rounded-md peer-disabled:cursor-not-allowed dark:peer-checked:bg-black peer-checked:bg-white peer-disabled:opacity-60',
              'outline-current peer-focus-visible:outline peer-focus-visible:outline-2',
              props.highlighted &&
                'from-purple-100 to-pink-100 peer-checked:bg-gradient-to-r peer-checked:text-white',
              !props.highlighted &&
                'dark:peer-checked:bg-black peer-checked:bg-white',
            )}
          >
            {option.label ?? option.value}
          </span>
        </label>
      ))}
    </div>
  )
}
