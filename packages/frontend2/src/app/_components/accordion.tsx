'use client';

import * as RadixAccordion from '@radix-ui/react-accordion';
import React, { type ReactElement } from 'react';
import { cn } from '~/utils/cn';

interface AccordionProps {
  children:
    | ReactElement<typeof RadixAccordion.Item>
    | ReactElement<typeof RadixAccordion.Item>[];
  type?: 'single' | 'multiple';
  className?: string;
  indicator?: React.ReactNode;
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
  );
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
));
AccordionItem.displayName = RadixAccordion.Item.displayName;

const AccordionContent = RadixAccordion.Content;
const AccordionTrigger = RadixAccordion.Trigger;

export { AccordionContent, AccordionItem, Accordion, AccordionTrigger };
