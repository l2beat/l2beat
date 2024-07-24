'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'
import CheckIcon from '~/icons/check.svg'
import { cn } from '~/utils/cn'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    id: string
  }
>(({ className, id, children, ...props }, ref) => (
  <div className="flex h-8 select-none items-center space-x-2 rounded-lg bg-gray-200 py-1 pl-2 pr-3 text-base font-semibold dark:bg-zinc-700">
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        'peer size-4 shrink-0 rounded-sm bg-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:focus-visible:ring-zinc-800',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon className="size-4 stroke-black stroke-[1.8px] dark:stroke-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    <label
      htmlFor={id}
      className="cursor-pointer whitespace-pre leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  </div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
