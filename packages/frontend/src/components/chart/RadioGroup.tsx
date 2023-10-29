import cx from 'classnames'
import React from 'react'

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
      className={cx(
        'bg-gray-200 text-base font-medium dark:bg-gray-750',
        'inline-flex items-center gap-1 rounded-lg p-1',
        props.className,
      )}
    >
      {props.options.map((option, i) => (
        <label
          key={i}
          className={cx(
            'relative block select-none',
            props.optionsClassname,
            option.className,
          )}
        >
          <input
            className="peer absolute top-0 left-0 block h-full w-full cursor-pointer opacity-0"
            defaultChecked={option.checked}
            autoComplete="off"
            type="radio"
            name={props.name}
            value={option.value}
          />
          <span
            className={cx(
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
