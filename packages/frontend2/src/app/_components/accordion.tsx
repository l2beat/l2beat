'use client'
import React, { useState, type ReactElement } from 'react'
import ChevronDownIcon from '~/icons/chevron.svg'
import { cn } from '~/utils/cn'

interface AccordionProps {
  children:
    | ReactElement<AccordionItemProps>
    | ReactElement<AccordionItemProps>[]
  type?: 'single' | 'multiple'
  className?: string
  indicator?: React.ReactNode
}

export function Accordion({
  children,
  type = 'single',
  className,
}: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
        <ChevronDownIcon className="fill-current transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
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
      className={cn('group-data-[open]/accordion-item:block', className)}
    >
      {children}
    </div>
  )
}
