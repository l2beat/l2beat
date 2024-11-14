'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React, { useRef, useState } from 'react'
import { useBreakpoint } from '~/hooks/use-breakpoint'
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
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const [open, setOpen] = useState(!!props.defaultOpen)

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
      <TooltipTriggerContextProvider value={{ open, setOpen }}>
        {children}
      </TooltipTriggerContextProvider>
    </TooltipPrimitive.Root>
  )
}

const TooltipTrigger = ({
  ref,
  disabledOnMobile,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger> & {
  disabledOnMobile?: boolean
}) => {
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
}
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = ({
  ref,
  className,
  sideOffset = 8,
  fitContent,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  fitContent?: boolean
}) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'bg-[#1F1F38]',
      'text-left text-sm font-normal normal-case leading-tight text-white ',
      'z-110 rounded-md px-4 py-3 shadow-md',
      'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      !fitContent && 'max-w-[300px] text-wrap',
      className,
    )}
    {...props}
  />
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
