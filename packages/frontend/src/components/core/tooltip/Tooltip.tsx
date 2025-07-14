import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import { useRef, useState } from 'react'
import { useIsMobile } from '~/hooks/useIsMobile'
import { mergeRefs } from '~/utils/mergeRefs'
import {
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './TooltipTriggerContext'

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
  const isMobile = useIsMobile()
  const { setOpen } = useTooltipTriggerContext()

  if (props.disabled) {
    return props.children
  }

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

const tooltipContentVariants = cva(
  'fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-110 origin-(--radix-tooltip-content-transform-origin) animate-in rounded-lg bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary normal-case shadow-popover data-[state=closed]:animate-out max-sm:max-w-screen dark:bg-header-secondary',
  {
    variants: {
      fitContent: {
        false: 'max-w-[380px] text-wrap',
      },
    },
    defaultVariants: {
      fitContent: false,
    },
  },
)

const TooltipContent = ({
  ref,
  className,
  sideOffset = 8,
  fitContent,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={tooltipContentVariants({ fitContent, className })}
    {...props}
  />
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipPortal = TooltipPrimitive.Portal
TooltipPortal.displayName = TooltipPrimitive.Portal.displayName

export {
  Tooltip,
  TooltipContent,
  tooltipContentVariants,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
}
