'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
import { cn } from '~/utils/cn'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'h-full inline-flex items-center gap-x-2 md:gap-x-8 border-collapse border-b border-gray-200 dark:border-zinc-700 w-full text-base',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'group relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-3 font-semibold transition-all outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-pink-900 dark:data-[state=active]:text-pink-200 data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
    <span className="absolute bottom-0 left-0 block h-1 w-full rounded-t-sm bg-gray-700 opacity-0 transition-all duration-300 group-hover:opacity-80  group-data-[state=active]:opacity-100 group-data-[state=active]:bg-pink-900 dark:group-data-[state=active]:bg-pink-200" />
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-3 md:mt-6', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
