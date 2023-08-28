import cx from 'classnames'
import React, { ReactNode } from 'react'

interface TogglableDropdownProps {
  className?: string
  button: ReactNode
  role: string
  children: ReactNode
  centered?: boolean
}

export function TogglableDropdown(props: TogglableDropdownProps) {
  return (
    <div className="Dropdown">
      <div
        className={cx(
          'rounded-lg bg-gray-200 px-1 py-1 dark:bg-gray-750',
          props.className,
        )}
      >
        {props.button}
      </div>
      <TogglableDropdownContent dataRole={props.role} centered={props.centered}>
        {props.children}
      </TogglableDropdownContent>
    </div>
  )
}

interface TogglableDropdownContentProps {
  children: ReactNode
  dataRole: string
  centered?: boolean
}

function TogglableDropdownContent(props: TogglableDropdownContentProps) {
  return (
    <div
      className="Dropdown-Transparent-Item pointer-events-none absolute z-60 mr-8 opacity-0 transition-opacity duration-300"
      data-role={props.dataRole}
      data-centered={props.centered}
    >
      <hr className="h-1.5 border-t-0" />
      <div className="rounded-lg bg-gray-200 p-6 dark:bg-gray-750">
        {props.children}
      </div>
    </div>
  )
}
