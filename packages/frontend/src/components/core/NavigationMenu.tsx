import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import type * as React from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

const NavigationMenu = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center',
      className,
    )}
    {...props}
  >
    {children}
  </NavigationMenuPrimitive.Root>
)
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none flex-wrap items-center gap-1.5',
      className,
    )}
    {...props}
  />
)
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  'group inline-flex w-max items-center justify-center rounded-md bg-surface-primary px-2 py-1.5 font-medium text-xs transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
)

const NavigationMenuTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(
      navigationMenuTriggerStyle(),
      'group flex gap-1.5',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronIcon
      className="group-data-[state=open]:-rotate-180 ml-1 size-3 transition-transform duration-200"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
)
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'absolute z-20 rounded-md p-2 shadow-lg',
      'mt-[5px] w-fit bg-surface-primary',
      'data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 data-[state=closed]:animate-out data-[state=open]:animate-in',
      'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-motion:zoom-in-100! data-motion:zoom-out-100! data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
      className,
    )}
    {...props}
  />
)
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
}
