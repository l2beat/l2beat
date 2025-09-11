'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'

function Tabs({
  className,
  variant,
  name,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: 'highlighted'
  name: string
}) {
  const { track } = useTracking()

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-variant={variant}
      className={cn('group/tabs flex flex-col gap-2', className)}
      onValueChange={(val) => {
        onValueChange?.(val)
        track('tabsChanged', {
          props: {
            name: name,
            value: val,
          },
        })
      }}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-10 w-full items-center justify-center rounded-lg bg-surface-secondary p-1.5',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'group/tabs-trigger inline-flex size-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 font-bold text-label-value-15',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-pure-white data-[state=active]:text-primary dark:data-[state=active]:bg-black',
        'group-data-[variant=highlighted]/tabs:data-[state=active]:bg-brand group-data-[variant=highlighted]/tabs:data-[state=active]:text-primary-invert',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
