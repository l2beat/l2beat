import { Drawer } from '@base-ui/react/drawer'
import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { useBreakpoint } from '~/hooks/useBreakpoint'
import { cn } from '~/utils/cn'
import { ScrollWithGradient } from '../ScrollWithGradient'
import { HorizontalSeparator } from './HorizontalSeparator'

const SIDEBAR_WIDTH = '15rem'
/** Lets the mobile menu buttons point `aria-controls` at the sheet. */
export const MOBILE_SIDEBAR_ID = 'mobile-sidebar'

type SidebarContextProps = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)
// Apart from the open state, so the menu's own contents, which only close it,
// don't re-render each time it opens.
const SetSidebarOpenContext = React.createContext<
  ((open: boolean) => void) | null
>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function useSetSidebarOpen() {
  const setOpen = React.useContext(SetSidebarOpenContext)
  if (!setOpen) {
    throw new Error('useSetSidebarOpen must be used within a SidebarProvider.')
  }
  return setOpen
}

function SidebarProvider({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [openMobile, setOpenMobile] = React.useState(false)

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      openMobile,
      setOpenMobile,
    }),
    [openMobile],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <SetSidebarOpenContext.Provider value={setOpenMobile}>
        <div
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper flex min-h-svh w-full flex-col bg-background',
            // A page that brings a `PageBackdrop` gets a stacking context, so the
            // scenery stays above this background and the nav paints none of its own.
            // An attribute, not `:has()`: under `:has()`, a node inserted
            // anywhere on the page restyles all of it.
            'data-with-backdrop:relative data-with-backdrop:isolate',
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SetSidebarOpenContext.Provider>
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

  if (breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md') {
    return (
      <Drawer.Root
        open={openMobile}
        onOpenChange={setOpenMobile}
        swipeDirection="right"
      >
        {/* Mounted and laid out from page load (see `keepRendered`), so
            opening only flips `data-closed` and the slide starts on the next
            frame. Building the menu on tap, and the frames Base UI holds a
            starting style for, made the tap feel unanswered. */}
        <Drawer.Portal keepMounted>
          {/* iPhone Safari tints its toolbars from the backdrop and swaps the
              tint in one frame, so on phones the backdrop matches the sheet and
              nothing animates. The 1% see-through keeps Chrome drawing the page
              beneath, so closing isn't delayed on Android. From `sm` the page
              beside the sheet stays dimmed and iPad Safari leaves its toolbar
              untinted, so the dim fades and the sheet slides; both follow a
              swipe. */}
          <Drawer.Backdrop
            className="fixed inset-0 z-998 bg-black/40 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-[opacity,visibility] duration-450 ease-drawer data-closed:invisible data-closed:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)] data-swiping:duration-0 max-sm:bg-background/99 max-sm:transition-none"
            render={keepRendered}
          />
          <Drawer.Viewport
            className="fixed inset-0 z-999 flex justify-end data-closed:pointer-events-none"
            render={keepRendered}
          >
            {/* From the right, next to the menu button that opens it: the
                whole screen on phones, the desktop sidebar's width from
                tablets up. */}
            <Drawer.Popup
              id={MOBILE_SIDEBAR_ID}
              className="h-full w-full bg-background/99 text-primary shadow-lg outline-none transition-[transform,visibility] duration-450 ease-drawer [transform:translateX(var(--drawer-swipe-movement-x))] data-closed:invisible data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)] data-swiping:duration-0 max-sm:transition-none sm:max-w-sm md:max-w-60 data-closed:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]"
              render={keepRendered}
            >
              <Drawer.Title className="sr-only">Menu</Drawer.Title>
              <div className="flex size-full flex-col gap-6">{children}</div>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return (
    <div className="group hidden text-primary lg:block">
      {/* This is what handles the sidebar gap on desktop */}
      <div className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear" />
      <div
        className={cn(
          'fixed inset-y-0 left-0 hidden h-svh w-(--sidebar-width) duration-200 ease-linear md:flex',
          className,
        )}
        {...props}
      >
        <div className="flex size-full flex-col gap-6 bg-background group-data-with-backdrop/sidebar-wrapper:bg-transparent">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Drops the `hidden` Base UI sets on a closed, kept-mounted drawer, which
 * Tailwind's preflight turns into an unbeatable `display: none`. The closed
 * menu stays laid out, invisible and off-screen, so opening it only reveals it:
 * styling, laying out and painting it on tap stalled its first frames.
 */
function keepRendered({ hidden: _, ...props }: React.ComponentProps<'div'>) {
  return <div {...props} />
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
  return <HorizontalSeparator className={cn('my-1', className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const list = ref.current
    if (!list) return
    // The list shrinks after hydration, when the client-only what's new
    // block mounts under it, so check again whenever its size changes.
    const observer = new ResizeObserver(() => scrollCurrentPageIntoView(list))
    observer.observe(list)
    return () => observer.disconnect()
  }, [])
  return (
    <ScrollWithGradient
      ref={ref}
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-1 overflow-auto',
        className,
      )}
      {...props}
    />
  )
}

/**
 * On a short window the current page's link can sit below the fold or under
 * the list's 48px fade, which leaves no sign of where you are. Centring it
 * clears both fades.
 */
function scrollCurrentPageIntoView(list: HTMLElement) {
  // A page's link comes after its group's, so the last match is the page.
  const active = [...list.querySelectorAll('[data-active="true"]')].at(-1)
  if (!active) return
  const listBox = list.getBoundingClientRect()
  const box = active.getBoundingClientRect()
  const fade = 48
  if (box.top >= listBox.top + fade && box.bottom <= listBox.bottom - fade) {
    return
  }
  list.scrollTop += box.top - listBox.top - (listBox.height - box.height) / 2
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

function SidebarGroupItem({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative font-medium text-sm leading-none', className)}
      {...props}
    />
  )
}

/** A heading over a run of groups, e.g. "And more": sentence case, like the links under it. */
function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'pl-1.5 font-medium text-label-value-13 text-secondary',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupLink({
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  isActive?: boolean
}) {
  return (
    <a
      data-active={isActive}
      className={cn(
        'group flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-1.5 text-left text-base outline-none ring-brand focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0',
        'data-[active=true]:text-nav-active',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupSub({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'ml-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-divider border-l py-0.5 pl-[13px]',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupSubButton({
  asChild = false,
  isActive,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-active={isActive}
      className={cn(
        '-translate-x-px flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded px-2.5 py-1.5 text-primary outline-none ring-brand hover:bg-surface-tertiary hover:text-primary focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0 [&>svg]:text-primary',
        'data-[active=true]:bg-brand data-[active=true]:text-primary-invert',
        className,
      )}
      {...props}
    />
  )
}

function SidebarGroupSubLink({
  isActive,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  isActive?: boolean
}) {
  return (
    <a
      data-active={isActive}
      className={cn(
        'font-medium text-label-value-14',
        'data-[active=true]:text-nav-active',
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
  SidebarGroupItem,
  SidebarGroupLabel,
  SidebarGroupSub,
  SidebarGroupSubButton,
  SidebarGroupSubLink,
  SidebarProvider,
  SidebarSeparator,
  useSetSidebarOpen,
  useSidebar,
}
