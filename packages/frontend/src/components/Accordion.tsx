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
    <div data-role="accordion" className={cn('group/accordion', className)}>
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
    <div
      data-role="accordion-trigger"
      className={cn(
        'flex cursor-pointer items-center justify-between',
        className,
      )}
    >
      <div className={childrenClassName}>{children}</div>
      <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion:-rotate-180" />
    </div>
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
      className={cn('hidden group-data-[open]/accordion:block', className)}
    >
      {children}
    </div>
  )
}
