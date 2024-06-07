import React, { forwardRef, ReactNode } from 'react'

import { cn } from '../utils/cn'
import { ChevronDownIcon } from './icons'

interface HoverableDropdownProps {
  className?: string
  title: ReactNode
  children: ReactNode
}

export const HoverableDropdown = forwardRef<
  HTMLDivElement,
  HoverableDropdownProps
>((props, ref) => {
  return (
    <div
      data-role="hoverable-dropdown"
      className={cn('group relative w-min whitespace-pre', props.className)}
    >
      <HoverableDropdownToggle toggleRef={ref}>
        {props.title}
      </HoverableDropdownToggle>
      <HoverableDropdownMenu>{props.children}</HoverableDropdownMenu>
    </div>
  )
})

interface HoverableDropdownToggleProps {
  children: ReactNode
  toggleRef?: React.Ref<HTMLDivElement>
}

function HoverableDropdownToggle(props: HoverableDropdownToggleProps) {
  return (
    <div
      ref={props.toggleRef}
      data-role="hoverable-dropdown-toggle"
      className="flex cursor-pointer flex-row items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1.5 font-medium text-xs transition-colors dark:bg-zinc-900 dark:group-hover:bg-zinc-700 group-hover:bg-gray-200"
    >
      {props.children}
      <ChevronDownIcon className="group-hover:-rotate-180 m-auto scale-75 transition-transform duration-300" />
    </div>
  )
}

interface HoverableDropdownMenuProps {
  className?: string
  children: ReactNode
}

function HoverableDropdownMenu(props: HoverableDropdownMenuProps) {
  return (
    <div
      data-role="hoverable-dropdown-menu"
      className="pointer-events-none absolute z-60 opacity-0 transition-opacity duration-300"
    >
      <hr className="h-1.5 border-t-0" />
      <div
        className={cn(
          'rounded-lg bg-gray-100 p-1 shadow-[0px_4px_20px_rgba(0,0,0,0.50)] dark:bg-zinc-900',
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  )
}
