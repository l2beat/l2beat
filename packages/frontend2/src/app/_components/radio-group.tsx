'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'
import { cn } from '~/utils/cn'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        'inline-flex w-max items-center gap-1 rounded-lg bg-gray-200 p-1 text-base font-medium dark:bg-zinc-700',
        className,
      )}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    variant?: 'highlighted'
  }
>(({ className, variant, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'rounded-md px-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-white dark:data-[state=checked]:bg-black',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-800',
        variant === 'highlighted' &&
          'from-purple-100 to-pink-100 data-[state=checked]:bg-gradient-to-r data-[state=checked]:text-white',
        className,
      )}
      {...props}
    />
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
