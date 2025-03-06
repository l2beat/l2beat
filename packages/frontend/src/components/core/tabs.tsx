'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { useSearchParamState } from '~/hooks/use-search-param-state'
import { cn } from '~/utils/cn'

/**
 * This component is a wrapper around the Radix Tabs component that allows you
 * to store the selected tab in the URL search params.
 */
const Tabs = ({
  ref,
  defaultValue: passedDefaultValue,
  storeInSearchParams = true,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  storeInSearchParams?: boolean
}) => {
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
}
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex size-full border-collapse items-center gap-x-2 border-b border-gray-200 text-base dark:border-zinc-700 md:gap-x-8',
      className,
    )}
    {...props}
  />
)
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'group relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-3 font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-brand data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
    <span className="absolute bottom-0 left-0 block h-1 w-full rounded-t-sm bg-gray-700 opacity-0 transition-all duration-300 group-hover:opacity-80  group-data-[state=active]:bg-brand group-data-[state=active]:opacity-100" />
  </TabsPrimitive.Trigger>
)
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-3 md:mt-6', className)}
    {...props}
  />
)
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
