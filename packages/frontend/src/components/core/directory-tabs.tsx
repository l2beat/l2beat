'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { useTracking } from '~/hooks/use-custom-event'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from './overflow-wrapper'

/**
 * This component is a wrapper around the Radix Tabs component that allows you
 * to store the selected tab in the URL search params.
 */
const DirectoryTabs = ({
  ref,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  const { track } = useTracking()
  return (
    <TabsPrimitive.Root
      ref={ref}
      defaultValue={defaultValue}
      onValueChange={(value) => {
        onValueChange?.(value)
        track('directoryTabsChanged', {
          props: {
            value,
          },
        })
      }}
      {...props}
    />
  )
}
DirectoryTabs.displayName = TabsPrimitive.Root.displayName

const DirectoryTabsList = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <OverflowWrapper className="sticky top-0 z-50 bg-background pr-4 pt-2 max-md:mt-2 md:pt-4">
    <TabsPrimitive.List
      ref={ref}
      className={cn('flex space-x-1 max-md:pl-4 md:space-x-2', className)}
      {...props}
    />
  </OverflowWrapper>
)
DirectoryTabsList.displayName = TabsPrimitive.List.displayName

const DirectoryTabsTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-t-md max-md:px-6 md:h-10 md:min-w-60 md:rounded-t-xl',
      'whitespace-nowrap text-xs font-bold md:text-sm',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
      'data-[state=inactive]:bg-surface-tertiary dark:data-[state=inactive]:bg-gradient-to-t dark:data-[state=inactive]:from-[#2A2C33] dark:data-[state=inactive]:to-[#1F2025]',
      'data-[state=active]:bg-surface-primary',
      className,
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
)
DirectoryTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const DirectoryTabsContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'rounded-xl rounded-tl-none bg-surface-primary px-4 pb-4 pt-3 primary-card max-md:rounded-none md:px-6 md:pb-6',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
      className,
    )}
    {...props}
  />
)
DirectoryTabsContent.displayName = TabsPrimitive.Content.displayName

export {
  DirectoryTabs,
  DirectoryTabsList,
  DirectoryTabsTrigger,
  DirectoryTabsContent,
}
