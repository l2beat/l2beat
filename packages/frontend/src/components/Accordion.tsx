import React, { ReactElement } from 'react'

import { cn } from '../utils/cn'
import { ChevronDownIcon } from './icons'

interface AccordionProps {
  children:
    | ReactElement<AccordionItemProps>
    | ReactElement<AccordionItemProps>[]
  type?: 'single' | 'multiple'
  className?: string
}

export function Accordion({
  children,
  type = 'single',
  className,
}: AccordionProps) {
  return (
    <div data-role="accordion" data-type={type} className={className}>
      {children}
    </div>
  )
}

interface AccordionItemProps {
  children: [
    ReactElement<AccordionTriggerProps>,
    ReactElement<AccordionContentProps>,
  ]
  className?: string
}

export function AccordionItem({ children, className }: AccordionItemProps) {
  return (
    <div
      data-role="accordion-item"
      className={cn('group/accordion-item', className)}
    >
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  childrenClassName?: string
  indicator?: React.ReactNode
}

export function AccordionTrigger({
  children,
  className,
  childrenClassName,
  indicator,
}: AccordionTriggerProps) {
  return (
    <div
      data-role="accordion-trigger"
      className={cn(
        'flex cursor-pointer items-center justify-between gap-2 md:gap-4',
        className,
      )}
    >
      <div className={cn('w-full', childrenClassName)}>{children}</div>
      {indicator ? (
        indicator
      ) : (
        <ChevronDownIcon className="transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
      )}
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
      className={cn('hidden group-data-[open]/accordion-item:block', className)}
    >
      {children}
    </div>
  )
}
