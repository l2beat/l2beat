'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React, { useRef, useState } from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { cn } from '~/utils/cn'
import { mergeRefs } from '~/utils/merge-refs'
import {
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './tooltip-trigger-context'

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
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> & {
    disabledOnMobile?: boolean
  }
>(({ disabledOnMobile, ...props }, ref) => {
  const localRef = useRef(null)
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  const { setOpen } = useTooltipTriggerContext()

  // Tooltips do not work on mobile by default
  if (disabledOnMobile) {
    return <TooltipPrimitive.Trigger ref={ref} {...props} />
  }

  const onClick = isMobile
    ? (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(true)
      }
    : undefined

  return (
    <TooltipPrimitive.Trigger
      ref={mergeRefs(ref, localRef)}
      onClick={onClick}
      data-role="tooltip-trigger"
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
      'z-110 rounded-md bg-white px-4 py-3 text-left text-sm font-normal normal-case leading-tight text-gray-700 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-neutral-700 dark:text-white',
      !fitContent && 'max-w-[300px] text-wrap',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
