import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type * as React from 'react'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

const RadioGroup = ({
  ref,
  className,
  name,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  name: string
}) => {
  const { track } = useTracking()
  return (
    <RadioGroupPrimitive.Root
      name={name}
      className={cn(
        'group/radio-group inline-flex h-8 w-max items-center gap-1 rounded-lg p-1 font-medium',
        // Off a card the page is already --surface-secondary, so the track
        // steps one darker and keeps the white pill used inside cards
        'bg-surface-tertiary primary-card:bg-surface-secondary dark:bg-surface-secondary',
        className,
      )}
      {...props}
      onValueChange={(val) => {
        onValueChange?.(val)
        track('radioGroupChanged', {
          name: name,
          value: val,
        })
      }}
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
        'h-full rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
        'data-[state=checked]:bg-pure-white dark:data-[state=checked]:bg-black',
        className,
      )}
      {...props}
    />
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
