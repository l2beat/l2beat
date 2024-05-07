import React, { ReactElement } from 'react'

import { cn } from '../utils/cn'
import { ChevronDownIcon } from './icons'

interface AccordionProps {
  children: [
    ReactElement<AccordionTriggerProps>,
    ReactElement<AccordionContentProps>,
  ]
  className?: string
}

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div data-role="accordion" className={className}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  childrenClassName?: string
}

export function AccordionTrigger({
  children,
  className,
  childrenClassName,
}: AccordionTriggerProps) {
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
        data-role="accordion-trigger"
      />
      <div className={childrenClassName}>{children}</div>
      <ChevronDownIcon className="transition-transform duration-300 peer-checked:-rotate-180" />
    </label>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  return (
    <div
      data-role="accordion-content"
      className={cn('hidden data-[open]:block', className)}
    >
      {children}
    </div>
  )
}
