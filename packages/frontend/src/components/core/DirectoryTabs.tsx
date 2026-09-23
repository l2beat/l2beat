import * as TabsPrimitive from '@radix-ui/react-tabs'
import type * as React from 'react'
import { createContext, useContext } from 'react'
import { useQueryParam } from '~/hooks/useQueryParam'
import { useTracking } from '~/hooks/useTracking'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from './OverflowWrapper'

const SelectedDirectoryTabContext = createContext<string | undefined>(undefined)
const IsDirectoryTabActiveContext = createContext(true)

/**
 * This component is a wrapper around the Radix Tabs component that allows you
 * to store the selected tab in the URL search params.
 *
 * Every panel is mounted and inactive ones are hidden, so the server HTML
 * carries the content of all tabs, not just the selected one.
 */
const DirectoryTabs = ({
  ref,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  defaultValue: string
}) => {
  const [selectedTab, setSelectedTab] = useQueryParam('tab', defaultValue, {
    replaceState: true,
  })

  const { track } = useTracking()
  return (
    <SelectedDirectoryTabContext.Provider value={selectedTab}>
      <TabsPrimitive.Root
        ref={ref}
        value={selectedTab}
        onValueChange={(value) => {
          onValueChange?.(value)
          setSelectedTab(value)
          track('directoryTabsChanged', {
            value,
          })
        }}
        {...props}
      />
    </SelectedDirectoryTabContext.Provider>
  )
}
DirectoryTabs.displayName = TabsPrimitive.Root.displayName

const DirectoryTabsList = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <div className="sticky top-0 z-50 bg-background pt-2 max-md:mt-2 md:pt-4">
    <OverflowWrapper className="pr-4">
      <TabsPrimitive.List
        ref={ref}
        className={cn('flex space-x-1 max-md:pl-4 md:space-x-2', className)}
        {...props}
      />
    </OverflowWrapper>
  </div>
)
DirectoryTabsList.displayName = TabsPrimitive.List.displayName

const DirectoryTabsTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-t-md max-md:px-6 md:h-10 md:min-w-60 md:rounded-t-xl',
      'whitespace-nowrap font-bold text-xs md:text-sm',
      'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
      'data-[state=inactive]:bg-surface-tertiary dark:data-[state=inactive]:bg-linear-to-t dark:data-[state=inactive]:from-[#2A2C33] dark:data-[state=inactive]:to-[#1F2025]',
      'data-[state=active]:bg-surface-primary',
      className,
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
)
DirectoryTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const DirectoryTabsContent = ({
  ref,
  className,
  value,
  children,
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Content>, 'forceMount'>) => {
  const isActive = useContext(SelectedDirectoryTabContext) === value
  return (
    <TabsPrimitive.Content
      ref={ref}
      value={value}
      forceMount
      // Radix leaves force-mounted panels visible, so hide inactive ones here
      hidden={!isActive}
      className={cn(
        'primary-card rounded-xl rounded-tl-none bg-surface-primary px-4 pt-3 pb-4 max-md:rounded-none md:px-6 md:pb-6',
        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
        className,
      )}
      {...props}
    >
      <IsDirectoryTabActiveContext.Provider value={isActive}>
        {children}
      </IsDirectoryTabActiveContext.Provider>
    </TabsPrimitive.Content>
  )
}
DirectoryTabsContent.displayName = TabsPrimitive.Content.displayName

/**
 * Renders its children only while the enclosing panel is active, the way
 * Radix mounts panels by default. For panel parts that shouldn't be
 * force-mounted: client-fetched charts carry no crawlable data, would fire
 * their queries for every tab at once and repeat the same heading per panel.
 */
function DirectoryTabsActiveOnly({ children }: { children: React.ReactNode }) {
  return useContext(IsDirectoryTabActiveContext) ? children : null
}

export {
  DirectoryTabs,
  DirectoryTabsActiveOnly,
  DirectoryTabsList,
  DirectoryTabsTrigger,
  DirectoryTabsContent,
}
