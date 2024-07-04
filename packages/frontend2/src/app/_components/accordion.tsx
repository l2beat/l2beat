'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import React, { type ReactElement } from 'react'
import ChevronDownIcon from '~/icons/chevron.svg'
import { cn } from '~/utils/cn'

interface AccordionProps {
  children:
    | ReactElement<typeof RadixAccordion.Item>
    | ReactElement<typeof RadixAccordion.Item>[]
  type?: 'single' | 'multiple'
  className?: string
  indicator?: React.ReactNode
}

function Accordion({ children, type = 'single', className }: AccordionProps) {
  return (
    <RadixAccordion.Root
      type={type}
      data-role="accordion"
      className={className}
    >
      {children}
    </RadixAccordion.Root>
  )
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(({ children, className, ...props }, forwardedRef) => (
  <RadixAccordion.Item
    className={cn('group/accordion-item', className)}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </RadixAccordion.Item>
))
AccordionItem.displayName = RadixAccordion.Item.displayName

interface AccordionTriggerProps {
  childrenClassName?: string
  indicator?: React.ReactNode
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> &
    AccordionTriggerProps
>(
  (
    { children, className, childrenClassName, indicator, ...props },
    forwardedRef,
  ) => (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger
        className={cn(
          'group flex cursor-pointer items-center justify-between gap-2 md:gap-4',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <div className={cn('w-full', childrenClassName)}>{children}</div>

        {indicator ? (
          indicator
        ) : (
          <ChevronDownIcon className="fill-current transition-transform duration-300 ease-out group-data-[open]/accordion-item:rotate-180" />
        )}
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  ),
)
AccordionTrigger.displayName = RadixAccordion.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
  <RadixAccordion.Content className={className} {...props} ref={forwardedRef}>
    {children}
  </RadixAccordion.Content>
))
AccordionContent.displayName = RadixAccordion.Content.displayName

export { AccordionContent, AccordionItem, Accordion, AccordionTrigger }
