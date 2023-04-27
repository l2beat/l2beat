import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { ChevronDownIcon } from './icons'

interface ExpandableMenuProps {
  className?: string
  children: ReactNode
}
export function HoverableDropdown(props: ExpandableMenuProps) {
  return (
    <div className={classNames('HoverableDropdown group', props.className)}>
      {props.children}
    </div>
  )
}

HoverableDropdown.Toggle = function (props: ExpandableMenuProps) {
  return (
    <div className="HoverableDropdownToggle gray-100 relative flex cursor-pointer flex-row items-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-medium dark:bg-neutral-700 dark:group-hover:bg-gray-750">
      {props.children}
      <ChevronDownIcon className="m-auto scale-75 transition-transform duration-300 group-hover:-rotate-180" />
    </div>
  )
}

HoverableDropdown.Menu = function (props: ExpandableMenuProps) {
  return (
    <div className="HoverableDropdownMenu pointer-events-none absolute z-10 opacity-0 transition-opacity duration-300">
      <div className="h-1.5" />
      <div
        className={classNames(
          'rounded-lg bg-neutral-700 px-4 py-2.5 shadow-[0px_4px_20px_rgba(0,0,0,0.50)]',
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  )
}
