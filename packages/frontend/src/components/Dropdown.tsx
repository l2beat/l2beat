import React, { ReactElement } from 'react'

import { cn } from '../utils/cn'
import { ChevronDownIcon } from './icons'

interface DropdownProps {
  children: [
    ReactElement<DropdownTriggerProps>,
    ReactElement<DropdownContentProps>,
  ]
  className?: string
}

export function Dropdown({ children, className }: DropdownProps) {
  return (
    <div data-role="dropdown" className={className}>
      {children}
    </div>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode
  className?: string
  childrenClassName?: string
}

export function DropdownTrigger({
  children,
  className,
  childrenClassName,
}: DropdownTriggerProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center justify-between',
        className,
      )}
    >
      <input
        type="checkbox"
        autoComplete="off"
        className="peer hidden"
        data-role="dropdown-trigger"
      />
      <div className={childrenClassName}>{children}</div>
      <ChevronDownIcon className="transition-transform duration-300 peer-checked:-rotate-180" />
    </label>
  )
}

interface DropdownContentProps {
  children: React.ReactNode
  className?: string
}

export function DropdownContent({ children, className }: DropdownContentProps) {
  return (
    <div
      data-role="dropdown-content"
      className={cn('hidden data-[open]:block', className)}
    >
      {children}
    </div>
  )
}
