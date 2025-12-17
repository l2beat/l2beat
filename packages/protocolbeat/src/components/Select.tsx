import * as RadixSelect from '@radix-ui/react-select'
import clsx from 'clsx'
import { IconChecked } from '../icons/IconChcked'
import { IconChevronDown } from '../icons/IconChevronDown'
import { cn } from '../utils/cn'
import { Button } from './Button'

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Group: SelectGroup,
  Label: SelectLabel,
  Item: SelectItem,
}

function SelectRoot({ children, ...props }: RadixSelect.SelectProps) {
  return <RadixSelect.Root {...props}>{children}</RadixSelect.Root>
}

function SelectTrigger({
  children,
  className,
  placeholder,
  ...props
}: RadixSelect.SelectTriggerProps & { placeholder?: string }) {
  return (
    <RadixSelect.Trigger
      className={clsx(
        'inline-flex w-full leading-none outline-none focus:outline-none active:outline-none',
        className,
      )}
      {...props}
      asChild
    >
      <Button
        size="small"
        className="flex items-center justify-between data-[state=open]:border-b-0"
      >
        <RadixSelect.Value placeholder={placeholder ?? 'Select'} />
        <RadixSelect.Icon>
          <IconChevronDown />
        </RadixSelect.Icon>
      </Button>
    </RadixSelect.Trigger>
  )
}

function SelectContent({
  children,
  className,
  ...props
}: RadixSelect.SelectContentProps) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={cn(
          'z-[1000] max-h-[400px] border border-coffee-400 bg-coffee-600',
          className,
        )}
        position="popper"
        style={{ width: 'var(--radix-select-trigger-width)' }}
        {...props}
      >
        <RadixSelect.Viewport className="max-h-[400px] p-1">
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
}

function SelectGroup({
  children,
  className,
  ...props
}: RadixSelect.SelectGroupProps) {
  return (
    <RadixSelect.Group className={className} {...props}>
      {children}
    </RadixSelect.Group>
  )
}

function SelectLabel({
  children,
  className,
  ...props
}: RadixSelect.SelectLabelProps) {
  return (
    <RadixSelect.Label
      className={clsx('px-2 text-coffee-400 text-xs', className)}
      {...props}
    >
      {children}
    </RadixSelect.Label>
  )
}

function SelectItem({
  children,
  className,
  ...props
}: RadixSelect.SelectItemProps) {
  return (
    <RadixSelect.Item
      className={clsx(
        'group relative flex max-w-fit cursor-pointer select-none items-center border-coffee-400 py-1 pr-8 pl-6 text-xs leading-none hover:underline hover:outline-none focus:outline-none active:outline-none',
        className,
      )}
      {...props}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <IconChecked />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  )
}
