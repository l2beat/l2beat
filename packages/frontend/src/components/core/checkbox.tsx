'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as React from 'react'
import { CheckIcon } from '~/icons/check'
import { cn } from '~/utils/cn'

const Checkbox = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
  const id = React.useId()
  return (
    <div
      className={cn(
        'flex h-8 w-max select-none items-center space-x-2 rounded-lg bg-gray-200 py-1 pl-2 pr-3 dark:bg-zinc-700',
        'sidebar:!bg-surface-primary sidebar:main-page-card:!bg-surface-secondary',
        className,
      )}
    >
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          'peer size-5 shrink-0 rounded bg-pure-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
          'sidebar:data-[state=unchecked]:border-2 sidebar:data-[state=unchecked]:border-surface-tertiary',
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center rounded text-current sidebar:bg-brand">
          <CheckIcon
            className={cn(
              'size-5 stroke-black stroke-[1.8px] dark:stroke-white',
              'sidebar:!stroke-surface-primary sidebar:main-page-card:!stroke-surface-secondary',
            )}
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={id}
        className="cursor-pointer whitespace-pre text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:text-sm"
      >
        {children}
      </label>
    </div>
  )
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
