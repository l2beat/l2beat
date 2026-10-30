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
        'shrink-0 rounded-t-sm border-x border-t px-2.5 py-1 font-medium text-xs transition-colors',
        'data-[state=active]:border-coffee-600 data-[state=active]:bg-coffee-800 data-[state=active]:text-coffee-100',
        'data-[state=inactive]:border-transparent data-[state=inactive]:text-coffee-400 data-[state=inactive]:hover:text-coffee-200',
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
    <RadixTabs.Content {...props} className={cn('py-2', className)}>
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
        'flex gap-1 overflow-x-clip border-coffee-700 border-b',
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
