'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'
import { cn } from '~/utils/cn'

const RadioGroup = ({
  ref,
  className,
  variant,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  variant?: 'highlighted'
}) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        'group/radio-group inline-flex h-8 w-max items-center gap-1 rounded-lg bg-gray-200 p-1 font-medium dark:bg-zinc-700',
        'sidebar:!bg-surface-primary sidebar:main-page-card:!bg-surface-secondary',
        className,
      )}
      {...props}
      data-variant={variant}
      ref={ref}
    />
  )
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'h-6 rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        'group-data-[variant=highlighted]/radio-group:data-[state=checked]:bg-gradient-to-r group-data-[variant=highlighted]/radio-group:data-[state=checked]:from-purple-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:to-pink-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:text-white',
        'data-[state=checked]:bg-pure-white dark:data-[state=checked]:bg-black',
        'sidebar:data-[state=checked]:!bg-surface-tertiary sidebar:main-page-card:data-[state=checked]:!bg-pure-white dark:sidebar:main-page-card:data-[state=checked]:!bg-black',
        className,
      )}
      {...props}
    />
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
