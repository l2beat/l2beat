'use client'

import { type DialogProps } from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import { Command as CommandPrimitive } from 'cmdk'
import * as React from 'react'
import { SearchIcon } from '~/icons/search'
import { cn } from '~/utils/cn'
import { linkVariants } from '../link/custom-link'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'

const Command = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'custom-scrollbar bg-surface-primary primary-card:bg-surface-secondary flex size-full flex-col overflow-hidden rounded-md',
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
  ...props
}: DialogProps & {
  title: string
  description: string
  onEscapeKeyDown?: (event: KeyboardEvent) => void
}) => {
  return (
    <Dialog {...props}>
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <DialogContent
        className="shadow-popover top-1/2 overflow-hidden p-0 max-md:h-screen max-md:border-none md:top-1/4 max-md:[@supports(height:100dvh)]:h-dvh"
        overlayClassName="max-md:hidden"
        onEscapeKeyDown={onEscapeKeyDown}
      >
        <Slot className="[&_[cmdk-group-heading]]:text-secondary [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {children}
        </Slot>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) => {
  return (
    <div
      className="border-surface-tertiary flex items-center border-b px-3"
      cmdk-input-wrapper=""
    >
      <SearchIcon className="fill-secondary mr-2 size-4 shrink-0" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'outline-hidden placeholder:text-secondary! flex h-11 w-full bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50',
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
}: {
  children: React.ReactNode
  onClick: (() => void) | undefined
}) => (
  <button
    className={linkVariants({ underline: false, className: 'text-xs' })}
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
      'overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
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
    className={cn('bg-surface-tertiary -mx-1 h-px', className)}
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
      'rounded-xs outline-hidden data-[selected=true]:bg-surface-secondary data-[selected=true]:primary-card:bg-surface-tertiary relative flex cursor-default select-none items-center px-2 py-1.5 text-sm data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className,
    )}
    {...props}
  />
)

CommandItem.displayName = CommandPrimitive.Item.displayName

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandInputActionButton,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}
