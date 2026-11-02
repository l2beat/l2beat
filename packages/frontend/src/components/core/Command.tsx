import type { DialogProps } from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import { Command as CommandPrimitive } from 'cmdk'
import type * as React from 'react'
import { SearchIcon } from '~/icons/Search'
import { cn } from '~/utils/cn'
import { linkVariants } from '../link/CustomLink'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './Dialog'

const Command = ({
  ref,
  className,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    ref={ref}
    onKeyDown={(e) => {
      onKeyDown?.(e)
      if (!e.defaultPrevented) followHighlightedLinkOnEnter(e)
    }}
    className={cn(
      'flex size-full flex-col overflow-hidden rounded-[inherit] border border-divider bg-surface-primary primary-card:bg-surface-secondary focus-visible:border-brand focus-visible:outline-none dark:border-transparent',
      className,
    )}
    {...props}
  />
)
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({
  children,
  title,
  description,
  onEscapeKeyDown,
  onOpenAutoFocus,
  onCloseAutoFocus,
  fullScreenMobile,
  contentClassName,
  ...props
}: DialogProps & {
  title: string
  description: string
  fullScreenMobile?: boolean
  contentClassName?: string
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
}) => {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          // A palette, often opened from the keyboard: it opens quickly and
          // gets out of the way faster.
          'overflow-hidden p-0 ease-out-quint data-[state=closed]:duration-100 data-[state=open]:duration-150 max-md:border-none md:top-1/4 md:max-w-lg',
          !fullScreenMobile && 'max-md:top-1/3',
          contentClassName,
        )}
        onEscapeKeyDown={onEscapeKeyDown}
        onOpenAutoFocus={onOpenAutoFocus}
        onCloseAutoFocus={onCloseAutoFocus}
        fullScreenMobile={fullScreenMobile}
      >
        {/* The full-screen input row is sticky because iOS Safari only re-tints
            its status bar from a sticky or fixed bar at the top. */}
        <Slot
          className={cn(
            fullScreenMobile &&
              'max-md:[&_[cmdk-input-wrapper]]:sticky max-md:[&_[cmdk-input-wrapper]]:top-0 max-md:[&_[cmdk-input-wrapper]]:bg-surface-primary',
            'border-none! [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-secondary [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5',
          )}
        >
          {children}
        </Slot>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = ({
  ref,
  className,
  wrapperClassName,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  wrapperClassName?: string
}) => {
  return (
    <div
      className={cn(
        'flex items-center border-divider border-b px-3',
        wrapperClassName,
      )}
      cmdk-input-wrapper=""
    >
      <SearchIcon className="mr-2 size-4 shrink-0 fill-secondary" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-secondary! disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      {children}
    </div>
  )
}

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandInputActionButton = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick: (() => void) | undefined
  className?: string
}) => (
  <button
    className={linkVariants({
      underline: false,
      className: cn('text-xs', className),
    })}
    onClick={onClick}
  >
    {children}
  </button>
)

const CommandList = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'max-h-[300px] overflow-y-auto overflow-x-hidden overscroll-none',
      className,
    )}
    {...props}
  />
)

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = ({
  ref,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="px-4 py-6 text-center text-sm"
    {...props}
  />
)

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden border-divider border-b px-1.5 py-1 last:border-none only:border-none [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-xs',
      className,
    )}
    {...props}
  />
)

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-surface-tertiary', className)}
    {...props}
  />
)
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-surface-secondary primary-card:data-[selected=true]:bg-surface-tertiary data-[disabled=true]:opacity-50',
      className,
    )}
    {...props}
  />
)

CommandItem.displayName = CommandPrimitive.Item.displayName

/**
 * An item that is a real link, so Cmd/Ctrl-click, middle-click and "Copy
 * link" work like on any other link. Enter on the highlighted item is handled
 * by `Command`.
 *
 * `onFollow` runs when the link is opened from the item, with whether it went
 * to a new tab: a dialog should stay open then, so several can be opened.
 */
const CommandLinkItem = ({
  href,
  onFollow,
  className,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof CommandPrimitive.Item>,
  'asChild' | 'onSelect'
> & {
  href: string
  onFollow?: (inNewTab: boolean) => void
}) => (
  <CommandItem asChild className={cn('cursor-pointer', className)} {...props}>
    <a
      href={href}
      // Arrow keys move through the items; Tab would stop on every one.
      tabIndex={-1}
      onClick={(e) => onFollow?.(opensInNewTab(e))}
      onAuxClick={(e) => {
        if (e.button === 1) onFollow?.(true)
      }}
    >
      {children}
    </a>
  </CommandItem>
)

/**
 * cmdk turns Enter into the item's `onSelect`, which can't see modifier
 * keys. A link item, or a link inside an item, is followed here instead: Enter clicks it, and Enter with
 * the modifier a click would use for a new tab opens one.
 */
function followHighlightedLinkOnEnter(e: React.KeyboardEvent<HTMLDivElement>) {
  // Same IME guard as cmdk: 229 is Enter confirming a composition.
  const isComposing = e.nativeEvent.isComposing || e.keyCode === 229
  if (e.key !== 'Enter' || isComposing) return
  const link = e.currentTarget.querySelector(
    'a[cmdk-item][aria-selected="true"], [cmdk-item][aria-selected="true"] a[href]',
  )
  if (!(link instanceof HTMLAnchorElement)) return
  e.preventDefault()

  if (!opensInNewTab(e)) {
    link.click()
    return
  }
  // Browsers differ in whether a scripted click honours modifier keys, so
  // the click only tells `onFollow`, and the tab is opened here.
  link.addEventListener('click', (click) => click.preventDefault(), {
    once: true,
  })
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      metaKey: e.metaKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
    }),
  )
  window.open(link.href, '_blank', 'noopener')
}

/** Shift opens a new window, which leaves this tab open just the same. */
function opensInNewTab(e: {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
}) {
  return e.metaKey || e.ctrlKey || e.shiftKey
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandInputActionButton,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandLinkItem,
  CommandSeparator,
}
