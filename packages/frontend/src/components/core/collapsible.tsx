'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import React from 'react'
import { cn } from '~/utils/cn'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    {...props}
    className={cn(
      className,
      'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden',
    )}
  >
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
)
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
