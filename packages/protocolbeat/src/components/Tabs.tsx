import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '../utils/cn'

function TabsRoot({ children, ...props }: RadixTabs.TabsProps) {
  return <RadixTabs.Root {...props}>{children}</RadixTabs.Root>
}

function TabsTrigger({
  children,
  className,
  ...props
}: RadixTabs.TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'flex-shrink-0 rounded-t-md border-coffee-400 border-x border-t border-b-none px-2 py-1 text-xs',
        'lg:px-2 lg:py-1 lg:text-xs',
        'px-1 py-0.5 text-2xs',
        'data-[state=active]:border-coffee-400 data-[state=active]:bg-coffee-400',
        'data-[state=inactive]:border-coffee-400/50 data-[state="inactive"]:bg-coffee-400/10',
        className,
      )}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  )
}

function TabsContent({
  children,
  className,
  ...props
}: RadixTabs.TabsContentProps) {
  return (
    <RadixTabs.Content className={cn('py-2', className)} {...props}>
      {children}
    </RadixTabs.Content>
  )
}

function TabsList({
  children,
  className,
  align = 'left',
  ...props
}: RadixTabs.TabsListProps & { align?: 'left' | 'right' }) {
  return (
    <RadixTabs.List
      className={cn(
        'flex overflow-x-clip border-coffee-400 border-b',
        align === 'left' ? 'justify-start' : 'justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </RadixTabs.List>
  )
}

export const Tabs = {
  Root: TabsRoot,
  Trigger: TabsTrigger,
  Content: TabsContent,
  List: TabsList,
}
