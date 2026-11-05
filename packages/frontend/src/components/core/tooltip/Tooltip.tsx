import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import { createContext, useContext, useId, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { mergeRefs } from '~/utils/mergeRefs'
import {
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './TooltipTriggerContext'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({
  children,
  contentInHtml,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  /**
   * Radix renders the content only on hover, so explanations kept in a
   * tooltip are invisible to crawlers and LLMs reading the server-rendered
   * HTML. This also renders the content as a visually hidden description of
   * the trigger. Use it only when the tooltip carries meaning not shown
   * elsewhere on the page. The copy renders where TooltipContent does, so it
   * does not work with TooltipPortal, which renders nothing while closed.
   */
  contentInHtml?: boolean
}) => {
  const [open, setOpen] = useState(!!props.defaultOpen)
  const id = useId()
  const contentDescriptionId = contentInHtml ? `${id}-description` : undefined

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
      <TooltipTriggerContextProvider
        value={{ open: props.open ?? open, setOpen, contentDescriptionId }}
      >
        {children}
      </TooltipTriggerContextProvider>
    </TooltipPrimitive.Root>
  )
}

const TooltipTrigger = ({
  ref,
  disabledOnTouch,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger> & {
  /**
   * A tap does what the trigger does, e.g. follows its link, and never opens
   * the tooltip.
   */
  disabledOnTouch?: boolean
}) => {
  const localRef = useRef(null)
  // Whether the tooltip was open when the last touch or pen press began.
  const tapStartedOpen = useRef<boolean>(undefined)
  const { open, setOpen, contentDescriptionId } = useTooltipTriggerContext()
  // While open, Radix adds the id of its own copy of the same content, so the
  // HTML copy would make screen readers read it twice.
  const describedBy = open ? undefined : contentDescriptionId

  if (props.disabled) {
    return props.children
  }

  // Radix opens a tooltip on hover and focus only, never on a tap
  if (disabledOnTouch) {
    return (
      <TooltipPrimitive.Trigger
        ref={ref}
        aria-describedby={describedBy}
        {...props}
      />
    )
  }

  // Touch has no hover, so the first tap opens the tooltip in place of the
  // trigger's own action, and a tap on the open tooltip closes it or follows
  // its link. This goes by the tap, not the width: an iPad in landscape is
  // as wide as a laptop, and a click in a narrow window must still follow a
  // link. A key press has no pointer down, so it keeps the trigger's action.
  const onPointerDown = (e: React.PointerEvent) => {
    // Recorded before Radix closes an open tooltip on the same press.
    tapStartedOpen.current = e.pointerType === 'mouse' ? undefined : open
  }
  const onClick = (e: React.MouseEvent) => {
    const startedOpen = tapStartedOpen.current
    tapStartedOpen.current = undefined
    if (startedOpen !== false) return
    e.preventDefault()
    setOpen(true)
  }

  return (
    <TooltipPrimitive.Trigger
      ref={mergeRefs(ref, localRef)}
      onPointerDown={onPointerDown}
      onClick={onClick}
      data-role="tooltip-trigger"
      aria-describedby={describedBy}
      {...props}
    />
  )
}
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

/** The tooltip's look, without Radix's open and close animation. */
const tooltipSurfaceClassName =
  'z-110 rounded-lg bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary normal-case shadow-popover max-sm:max-w-screen dark:bg-header-secondary'

const tooltipContentVariants = cva(
  `fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin) animate-in data-[state=closed]:animate-out ${tooltipSurfaceClassName}`,
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

const InsideHtmlCopyContext = createContext(false)

const InPortalContext = createContext(false)

/**
 * Renders the tooltips inside it in a portal, above dialogs. Floating UI
 * places a tooltip that renders inside a CSS size container (`@container`)
 * away from its trigger, by the container's offset from the window.
 */
function TooltipsInPortal({ children }: { children: React.ReactNode }) {
  return <InPortalContext value={true}>{children}</InPortalContext>
}

const TooltipContent = ({
  ref,
  className,
  sideOffset = 8,
  fitContent,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>) => {
  const { contentDescriptionId } = useTooltipTriggerContext()
  const inPortal = useContext(InPortalContext)
  const content = (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={tooltipContentVariants({
        fitContent,
        className: cn(inPortal && 'z-1000', className),
      })}
      {...props}
    />
  )

  return (
    <>
      {contentDescriptionId && (
        // A span, unlike a div, is not split by the HTML parser when the
        // tooltip sits in phrasing content, so hydration stays consistent.
        <span id={contentDescriptionId} className="sr-only">
          <InsideHtmlCopyContext value={true}>
            {props.children}
          </InsideHtmlCopyContext>
        </span>
      )}
      {inPortal ? (
        <TooltipPrimitive.Portal>{content}</TooltipPrimitive.Portal>
      ) : (
        content
      )}
    </>
  )
}
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/**
 * Shown in the tooltip popup but left out of its HTML copy, for
 * parts that mean nothing as text (diagrams, "click to view details").
 */
const TooltipVisualOnly = ({ children }: { children: React.ReactNode }) => {
  const isInsideHtmlCopy = useContext(InsideHtmlCopyContext)
  return isInsideHtmlCopy ? null : children
}

/**
 * Left out of the tooltip popup but kept in its HTML copy, for text a
 * compact popup drops but crawlers and LLMs should still read.
 */
const TooltipHtmlCopyOnly = ({ children }: { children: React.ReactNode }) => {
  const isInsideHtmlCopy = useContext(InsideHtmlCopyContext)
  return isInsideHtmlCopy ? children : null
}

const TooltipPortal = TooltipPrimitive.Portal
TooltipPortal.displayName = TooltipPrimitive.Portal.displayName

export {
  Tooltip,
  TooltipContent,
  TooltipHtmlCopyOnly,
  tooltipContentVariants,
  TooltipProvider,
  tooltipSurfaceClassName,
  TooltipTrigger,
  TooltipPortal,
  TooltipsInPortal,
  TooltipVisualOnly,
}
