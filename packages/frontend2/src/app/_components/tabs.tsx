'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { cn } from '~/utils/cn'

/**
 * This component is a wrapper around the Radix Tabs component that allows you
 * to store the selected tab in the URL search params.
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    storeInSearchParams?: boolean
  }
>(({ defaultValue, storeInSearchParams = true, ...props }, ref) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const defaultValueFromSearchParams = searchParams.get('tab') ?? defaultValue

  const onValueChange = storeInSearchParams
    ? (value: string) => {
        const search = new URLSearchParams(searchParams)
        search.set('tab', value)
        router.replace(`${pathname}?${search.toString()}`)
      }
    : undefined

  return (
    <TabsPrimitive.Root
      ref={ref}
      defaultValue={defaultValueFromSearchParams}
      onValueChange={onValueChange}
      {...props}
    />
  )
})
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex size-full border-collapse items-center gap-x-2 border-b border-gray-200 text-base dark:border-zinc-700 md:gap-x-8',
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
      'group relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-3 font-semibold outline-none transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-pink-900 data-[state=active]:shadow-sm dark:data-[state=active]:text-pink-200',
      className,
    )}
    {...props}
  >
    {children}
    <span className="absolute bottom-0 left-0 block h-1 w-full rounded-t-sm bg-gray-700 opacity-0 transition-all duration-300 group-hover:opacity-80  group-data-[state=active]:bg-pink-900 group-data-[state=active]:opacity-100 dark:group-data-[state=active]:bg-pink-200" />
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
