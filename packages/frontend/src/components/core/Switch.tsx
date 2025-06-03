import * as SwitchPrimitives from '@radix-ui/react-switch'
import type * as React from 'react'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root> & { name: string }) {
  const { track } = useTracking()
  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand data-[state=unchecked]:bg-surface-tertiary',
        className,
      )}
      {...props}
      onCheckedChange={(checked) => {
        props.onCheckedChange?.(checked)
        track('switchChanged', {
          props: {
            name: props.name,
            value: checked.toString(),
          },
        })
      }}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-primary-invert shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitives.Root>
  )
}

export { Switch }
