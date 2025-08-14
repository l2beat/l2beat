import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type * as React from 'react'
import { useTracking } from '~/hooks/useTracking'
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
        'h-full rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        'group-data-[variant=highlighted]/radio-group:data-[state=checked]:bg-linear-to-r group-data-[variant=highlighted]/radio-group:data-[state=checked]:from-purple-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:to-pink-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:text-white',
        'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
        className,
      )}
      {...props}
    />
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
