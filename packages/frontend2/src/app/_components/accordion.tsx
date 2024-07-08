'use client';

import * as RadixAccordion from '@radix-ui/react-accordion';
import React, { type ReactElement } from 'react';
import ChevronDownIcon from '~/icons/chevron.svg';
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

interface AccordionTriggerProps {
  childrenClassName?: string;
  indicator?: React.ReactNode;
  mergeIndicator?: boolean;
}

const AccordionComposedTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger> &
    AccordionTriggerProps
>(
  (
    {
      children,
      className,
      childrenClassName,
      indicator,
      mergeIndicator,
      ...props
    },
    forwardedRef
  ) => {
    const indicatorComponent = indicator ? (
      indicator
    ) : (
      <ChevronDownIcon className='fill-current transition-transform duration-300 ease-out group-data-[state="open"]/accordion-item:rotate-180' />
    );

    const content = mergeIndicator ? (
      <div className={cn('w-full', childrenClassName)}>
        {children}
        {indicatorComponent}
      </div>
    ) : (
      <>
        <div className={cn('w-full', childrenClassName)}>{children}</div>
        {indicatorComponent}
      </>
    );

    return (
      <RadixAccordion.Header>
        <RadixAccordion.Trigger
          className={cn(
            'flex w-full cursor-pointer items-center justify-between gap-2 md:gap-4',
            className
          )}
          {...props}
          ref={forwardedRef}
        >
          {content}
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
    );
  }
);
AccordionComposedTrigger.displayName = RadixAccordion.Trigger.displayName;

const AccordionContent = RadixAccordion.Content;
const AccordionTrigger = RadixAccordion.Trigger;

export {
  AccordionContent,
  AccordionItem,
  Accordion,
  AccordionComposedTrigger,
  AccordionTrigger,
};
