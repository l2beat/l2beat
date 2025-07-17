import * as PopoverPrimitive from '@radix-ui/react-popover'
import type * as React from 'react'
import { cn } from '~/utils/cn'

const Popover = PopoverPrimitive.Root

const popoverTriggerClasses = cn(
  'group inline-flex cursor-pointer select-none items-center gap-1.5 whitespace-pre rounded-lg bg-surface-primary px-3 py-1 font-medium text-xs leading-none md:text-sm',
  'transition-colors data-[state=selected]:hover:bg-surface-secondary',
  'primary-card:bg-surface-secondary primary-card:data-[state=selected]:hover:bg-surface-tertiary',
  'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset',
)

const PopoverTrigger = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn(popoverTriggerClasses, className)}
    {...props}
  >
    {props.children}
  </PopoverPrimitive.Trigger>
)
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

const PopoverContent = ({
  ref,
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-110 rounded-lg border-none bg-surface-primary primary-card:bg-surface-secondary p-2 shadow-popover outline-none',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin) data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  />
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverAnchor = PopoverPrimitive.Anchor

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  popoverTriggerClasses,
}
