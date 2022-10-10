import cx from 'classnames'
import React from 'react'

export interface RadioGroupProps {
  role: string
  name: string
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
        'text-base font-medium bg-gray-200 dark:bg-gray-800',
        'inline-flex items-center p-1 gap-1 rounded-lg',
      )}
    >
      {props.options.map((option, i) => (
        <label
          key={i}
          className={cx(
            'block relative select-none cursor-pointer',
            option.className,
          )}
        >
          <input
            className="peer cursor-pointer block absolute top-0 left-0 w-full h-full opacity-0"
            defaultChecked={option.checked}
            autoComplete="off"
            type="radio"
            name={props.name}
            value={option.value}
          />
          <span
            className={cx(
              'block relative px-2',
              'peer-checked:bg-white dark:peer-checked:bg-black rounded-md',
              'peer-focus-visible:outline-2 peer-focus-visible:outline outline-current',
            )}
          >
            {option.value}
          </span>
        </label>
      ))}
    </div>
  )
}
