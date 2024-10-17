'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'
import { CheckIcon } from '~/icons/check'
import { cn } from '~/utils/cn'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    id: string
  }
>(({ className, id, children, ...props }, ref) => (
  <div className="flex h-8 w-max select-none items-center space-x-2 rounded-lg bg-gray-200 py-1 pl-2 pr-3 sidebar:!bg-surface-primary dark:bg-zinc-700">
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        'peer size-5 shrink-0 rounded bg-pure-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black',
        'sidebar:data-[state=unchecked]:border-2 sidebar:data-[state=unchecked]:border-surface-tertiary',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center rounded text-current sidebar:bg-brand">
        <CheckIcon className="size-5 stroke-black stroke-[1.8px] sidebar:!stroke-surface-primary dark:stroke-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    <label
      htmlFor={id}
      className="cursor-pointer whitespace-pre text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  </div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
