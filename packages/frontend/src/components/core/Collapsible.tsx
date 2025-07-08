import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import type React from 'react'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return (
    <CollapsiblePrimitive.Root
      className={cn(className, 'group/Collapsible')}
      {...props}
    />
  )
}

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => {
  const isClient = useIsClient()

  return (
    <CollapsiblePrimitive.CollapsibleContent
      ref={ref}
      {...props}
      className={cn(
        className,
        'overflow-hidden',
        isClient &&
          'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
      )}
    >
      {children}
    </CollapsiblePrimitive.CollapsibleContent>
  )
}
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
