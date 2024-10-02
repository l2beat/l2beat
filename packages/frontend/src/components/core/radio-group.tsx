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
        'group/radio-group inline-flex w-max items-center gap-1 rounded-lg bg-surface-secondary p-1 text-base font-medium',
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
        'rounded-md px-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-pure-white dark:data-[state=checked]:bg-black',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-800',
        'group-data-[variant=highlighted]/radio-group:from-purple-100 group-data-[variant=highlighted]/radio-group:to-pink-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:bg-gradient-to-r group-data-[variant=highlighted]/radio-group:data-[state=checked]:text-white',
        className,
      )}
      {...props}
    />
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
