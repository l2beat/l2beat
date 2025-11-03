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
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex size-full flex-col overflow-hidden rounded-md border border-divider bg-surface-primary primary-card:bg-surface-secondary focus-visible:border-brand focus-visible:outline-none',
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
  fullScreenMobile,
  ...props
}: DialogProps & {
  title: string
  description: string
  fullScreenMobile?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
}) => {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'overflow-hidden p-0 max-md:border-none md:top-1/4 md:max-w-lg',
          !fullScreenMobile && 'max-md:top-1/3',
        )}
        onEscapeKeyDown={onEscapeKeyDown}
        fullScreenMobile={fullScreenMobile}
      >
        <Slot className="border-none! [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-secondary [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5">
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
      className="flex items-center border-divider border-b px-3"
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
