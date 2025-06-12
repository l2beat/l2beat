import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { motion } from 'motion/react'
import * as React from 'react'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

const RadioGroupIdContext = React.createContext<string | undefined>(undefined)

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
  const groupId = React.useId()
  return (
    <RadioGroupIdContext.Provider value={groupId}>
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
    </RadioGroupIdContext.Provider>
  )
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

function RadioGroupIndicator({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Indicator>) {
  const groupId = React.useContext(RadioGroupIdContext)
  const indicatorId = `radio-group-indicator-circle-${groupId ?? 'default'}`

  return (
    <RadioGroupPrimitive.Indicator
      data-slot="radio-group-indicator"
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        className,
      )}
      {...props}
    >
      <motion.div
        key={indicatorId}
        data-slot="radio-group-indicator-circle"
        layoutId={indicatorId}
        className="absolute inset-0 h-full w-full rounded-md bg-white group-data-[variant=highlighted]/radio-group:bg-gradient-to-r group-data-[variant=highlighted]/radio-group:from-purple-100 group-data-[variant=highlighted]/radio-group:to-pink-100"
      />
    </RadioGroupPrimitive.Indicator>
  )
}
RadioGroupIndicator.displayName = RadioGroupPrimitive.Indicator.displayName

const RadioGroupItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'relative h-6 rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        'group-data-[variant=highlighted]/radio-group:data-[state=checked]:text-white',
        className,
      )}
      {...props}
    >
      <RadioGroupIndicator />
      <span className="relative">{props.children}</span>
    </RadioGroupPrimitive.Item>
  )
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
