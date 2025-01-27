'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import * as React from 'react'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'

const Accordion = AccordionPrimitive.Root

const AccordionItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'border-b border-gray-200 last:border-none dark:border-zinc-700',
      className,
    )}
    {...props}
  />
)
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all [&[data-state=open]>svg]:-rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronIcon className="size-4 shrink-0 fill-current transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
)
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
