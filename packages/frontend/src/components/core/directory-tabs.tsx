'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { useSearchParamState } from '~/hooks/use-search-param-state'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from './overflow-wrapper'

/**
 * This component is a wrapper around the Radix Tabs component that allows you
 * to store the selected tab in the URL search params.
 */
const DirectoryTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    storeInSearchParams?: boolean
  }
>(
  (
    { defaultValue: passedDefaultValue, storeInSearchParams = true, ...props },
    ref,
  ) => {
    const state = useSearchParamState('tab', passedDefaultValue, {
      shallow: true,
    })
    const [value, setValue] = storeInSearchParams ? state : [passedDefaultValue]

    return (
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={value}
        onValueChange={setValue}
        {...props}
      />
    )
  },
)
DirectoryTabs.displayName = TabsPrimitive.Root.displayName

const DirectoryTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <OverflowWrapper className="sticky top-0 z-10 bg-background pr-4 pt-2 max-md:mt-2 md:pt-4">
    <TabsPrimitive.List
      ref={ref}
      className={cn('flex space-x-1 max-md:pl-4 md:space-x-2', className)}
      {...props}
    />
  </OverflowWrapper>
))
DirectoryTabsList.displayName = TabsPrimitive.List.displayName

const DirectoryTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-t-md max-md:px-6 md:h-10 md:min-w-60 md:rounded-t-xl',
      'whitespace-nowrap text-xs font-bold md:text-sm',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
      'data-[state=inactive]:bg-surface-tertiary dark:data-[state=inactive]:bg-gradient-to-t dark:data-[state=inactive]:from-[#2A2C33]  dark:data-[state=inactive]:to-[#1F2025]',
      'data-[state=active]:bg-surface-primary',
      className,
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
))
DirectoryTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const DirectoryTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'rounded-xl rounded-tl-none bg-surface-primary px-5 pb-6 pt-3 max-md:rounded-tr-none',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
DirectoryTabsContent.displayName = TabsPrimitive.Content.displayName

export {
  DirectoryTabs,
  DirectoryTabsList,
  DirectoryTabsTrigger,
  DirectoryTabsContent,
}
