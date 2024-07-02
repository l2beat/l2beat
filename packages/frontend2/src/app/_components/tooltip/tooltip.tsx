'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React, { useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import {
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './tooltip-trigger-context'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { mergeRefs } from '~/utils/merge-refs'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => {
  const [open, setOpen] = useState(!!props.defaultOpen)

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
      <TooltipTriggerContextProvider value={{ open, setOpen }}>
        {children}
      </TooltipTriggerContextProvider>
    </TooltipPrimitive.Root>
  )
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ ...props }, ref) => {
  const localRef = useRef(null)
  const { setOpen } = useTooltipTriggerContext()
  useOnClickOutside(localRef, () => setOpen(false), 'touchend')

  return (
    <TooltipPrimitive.Trigger
      ref={mergeRefs(ref, localRef)}
      onClick={() => {
        setOpen(true)
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        setOpen(true)
      }}
      {...props}
    />
  )
})
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    fitContent?: boolean
  }
>(({ className, sideOffset = 8, fitContent, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-110 rounded-md bg-white text-gray-700 dark:bg-neutral-700 dark:text-white px-4 py-3 text-left text-sm leading-tight shadow-md normal-case font-normal animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      !fitContent && 'text-wrap max-w-[300px]',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
