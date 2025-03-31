'use client'

import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/core/sheet'
import { TooltipProvider } from '~/components/core/tooltip/tooltip'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import { cn } from '~/utils/cn'
import { HorizontalSeparator } from './horizontal-separator'

const SIDEBAR_WIDTH = '15rem'
const SIDEBAR_WIDTH_MOBILE = '100%'

type SidebarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const breakpoint = useBreakpoint()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [setOpenProp, open],
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return breakpoint === 'mobile' || breakpoint === 'tablet'
      ? setOpenMobile((open) => !open)
      : setOpen((open) => !open)
  }, [breakpoint, setOpen, setOpenMobile])

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper min-h-svh w-full bg-background',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const breakpoint = useBreakpoint()
  const { openMobile, setOpenMobile } = useSidebar()

  if (breakpoint === 'mobile' || breakpoint === 'tablet') {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-mobile="true"
          className="w-[--sidebar-width] border-none bg-background p-0 text-primary [&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side="right"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex size-full flex-col gap-4">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="group hidden text-primary md:block" data-side="left">
      {/* This is what handles the sidebar gap on desktop */}
      <div className="relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear" />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-10 hidden h-svh w-[--sidebar-width] duration-200 ease-linear *:list-none md:flex',
          className,
        )}
        {...props}
      >
        <div className="flex size-full flex-col gap-6 bg-background">
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 px-5 pt-[18px]', className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-4 px-5 pb-5', className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof HorizontalSeparator>) {
  return <HorizontalSeparator className={cn('mx-2', className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-1 overflow-auto',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative flex w-full min-w-0 flex-col gap-1 px-5',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('relative text-sm font-medium leading-none', className)}
      {...props}
    />
  )
}

function SidebarGroupLink({
  isActive = false,
  className,
  ...props
}: React.ComponentProps<typeof Link> & {
  isActive?: boolean
}) {
  return (
    <Link
      data-active={isActive}
      className={cn(
        'flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-base outline-none ring-brand transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupSmallLink({
  isActive = false,
  className,
  ...props
}: React.ComponentProps<typeof Link> & {
  href: string
  isActive?: boolean
}) {
  const isInternalLink = props.href.startsWith('/')
  const Comp = isInternalLink ? Link : 'a'

  return (
    <Comp
      target={isInternalLink ? undefined : '_blank'}
      className={cn(
        'text-xs leading-none text-secondary transition-colors hover:text-primary',
        isActive && 'text-brand hover:text-brand',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-l border-divider px-2.5 py-0.5',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupSubItem(props: React.ComponentProps<'li'>) {
  return <li {...props} />
}

function SidebarGroupSubButton({
  asChild = false,
  isActive,
  className,
  ...props
}: React.ComponentProps<typeof Link> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : Link

  return (
    <Comp
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded px-2 text-primary outline-none ring-brand hover:bg-surface-tertiary hover:text-primary focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-primary',
        'data-[active=true]:bg-brand data-[active=true]:text-primary-invert',
        className,
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLink,
  SidebarGroupSmallLink,
  SidebarGroupItem,
  SidebarGroupSub,
  SidebarGroupSubButton,
  SidebarGroupSubItem,
  SidebarProvider,
  SidebarSeparator,
  useSidebar,
}
