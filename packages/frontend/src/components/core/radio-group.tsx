'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'
import { cn } from '~/utils/cn'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    variant?: 'highlighted'
  }
>(({ className, variant, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        'group/radio-group inline-flex w-max items-center gap-1 rounded-lg bg-gray-200 p-1 text-base font-medium dark:bg-zinc-700',
        'sidebar:!bg-surface-primary sidebar:main-page-card:!bg-surface-secondary',
        className,
      )}
      {...props}
      data-variant={variant}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'rounded-md px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand',
        'group-data-[variant=highlighted]/radio-group:data-[state=checked]:bg-brand group-data-[variant=highlighted]/radio-group:data-[state=checked]:text-white',
        'data-[state=checked]:bg-pure-white dark:data-[state=checked]:bg-black',
        className,
      )}
      {...props}
    />
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
