import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { ChevronDownIcon } from './icons'

interface HoverableDropdownProps {
  className?: string
  children: ReactNode
}

export function HoverableDropdown(props: HoverableDropdownProps) {
  return (
    <div className={classNames('HoverableDropdown group', props.className)}>
      {props.children}
    </div>
  )
}

interface HoverableDropdownToggleProps {
  children: ReactNode
}

HoverableDropdown.Toggle = function (props: HoverableDropdownToggleProps) {
  return (
    <div className="HoverableDropdownToggle relative flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 py-1.5 px-2 text-xs font-medium dark:bg-neutral-700 dark:group-hover:bg-gray-750">
      {props.children}
      <ChevronDownIcon className="m-auto scale-75 transition-transform duration-300 group-hover:-rotate-180" />
    </div>
  )
}

interface HoverableDropdownMenuProps {
  className?: string
  children: ReactNode
}

HoverableDropdown.Menu = function (props: HoverableDropdownMenuProps) {
  return (
    <div className="HoverableDropdownMenu pointer-events-none absolute z-10 opacity-0 transition-opacity duration-300">
      <hr className="h-1.5 border-t-0" />
      <div
        className={classNames(
          'rounded-lg bg-gray-100 px-4 py-2.5 shadow-[0px_4px_20px_rgba(0,0,0,0.50)] dark:bg-neutral-700',
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  )
}
