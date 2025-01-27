'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as React from 'react'
import { useTracking } from '~/hooks/use-custom-event'
import { cn } from '~/utils/cn'

const RadioGroup = ({
  ref,
  className,
  variant,
  name,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  name: string
  variant?: 'highlighted'
}) => {
  const { track } = useTracking()
  return (
    <RadioGroupPrimitive.Root
      name={name}
      className={cn(
        'group/radio-group inline-flex h-8 w-max items-center gap-1 rounded-lg p-1 font-medium',
        'bg-surface-primary primary-card:bg-surface-secondary',
        className,
      )}
      {...props}
      onValueChange={(val) => {
        onValueChange?.(val)
        track('radioGroupChanged', {
          props: {
            name: name,
            value: val,
          },
        })
      }}
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
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        'data-[state=checked]:group-data-[variant=highlighted]/radio-group:bg-linear-to-r data-[state=checked]:group-data-[variant=highlighted]/radio-group:from-purple-100 data-[state=checked]:group-data-[variant=highlighted]/radio-group:to-pink-100 data-[state=checked]:group-data-[variant=highlighted]/radio-group:text-white',
        'data-[state=checked]:bg-surface-tertiary data-[state=checked]:primary-card:bg-pure-white dark:data-[state=checked]:primary-card:bg-black',
        className,
      )}
      {...props}
    />
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
