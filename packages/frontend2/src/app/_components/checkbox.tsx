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
  <div className="flex select-none h-8 items-center space-x-2 bg-gray-200 font-semibold text-base dark:bg-zinc-700 rounded-lg py-1 pr-3 pl-2">
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm dark:bg-black bg-white shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon className="h-4 w-4 dark:stroke-white stroke-black stroke-[1.8px]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    <label
      htmlFor={id}
      className="cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  </div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
