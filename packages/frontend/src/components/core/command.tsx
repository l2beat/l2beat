'use client'

import { type DialogProps } from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import * as React from 'react'
import { SearchIcon } from '~/icons/search'
import { cn } from '~/utils/cn'
import { linkVariants } from '../link/custom-link'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    sidebar?: boolean
  }
>(({ className, sidebar, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'custom-scrollbar flex size-full flex-col overflow-hidden rounded-md',
      sidebar ? 'sidebar bg-surface-secondary' : 'bg-gray-200 dark:bg-zinc-700',
      className,
    )}
    {...props}
  />
))
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
        className="top-1/2 overflow-hidden p-0 shadow-lg max-md:h-screen max-md:border-none md:top-1/4 max-md:[@supports(height:100dvh)]:h-dvh"
        overlayClassName="max-md:hidden"
        onEscapeKeyDown={onEscapeKeyDown}
      >
        <Slot className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-secondary [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
          {children}
        </Slot>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    reset?: () => void
  }
>(({ className, reset, ...props }, ref) => {
  const search = useCommandState((state) => state.search)
  return (
    <div
      className="flex items-center border-b border-gray-400 px-3 sidebar:!border-surface-tertiary dark:border-gray-650"
      cmdk-input-wrapper=""
    >
      <SearchIcon className="mr-2 size-4 shrink-0 fill-gray-500 sidebar:!fill-secondary dark:fill-gray-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 sidebar:placeholder:!text-secondary dark:placeholder:text-gray-50',
          className,
        )}
        {...props}
      />
      {reset && (
        <button
          className={linkVariants({ underline: false, className: 'text-xs' })}
          onClick={reset}
        >
          {search !== '' ? 'Clear' : 'Close'}
        </button>
      )}
    </div>
  )
})

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'max-h-[300px] overflow-y-auto overflow-x-hidden overscroll-none',
      className,
    )}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="px-4 py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
      className,
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(
      '-mx-1 h-px bg-gray-400 sidebar:!bg-surface-tertiary dark:bg-gray-650',
      className,
    )}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-gray-400 data-[disabled=true]:opacity-50 sidebar:data-[selected='true']:!bg-surface-tertiary dark:data-[selected='true']:bg-zinc-800",
      className,
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}
