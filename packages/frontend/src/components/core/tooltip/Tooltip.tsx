import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import { createContext, useContext, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/utils/cn'
import { mergeRefs } from '~/utils/mergeRefs'
import { TooltipPopup, type TooltipPopupProps } from './TooltipPopup'
import {
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './TooltipTriggerContext'
import { TooltipProvider, useTooltipController } from './tooltipController'

/**
 * Tables put a tooltip in most cells and hardly any is ever opened, so a
 * closed tooltip is only a trigger element and a little state. Its popup
 * mounts while it is open, and TooltipProvider keeps one open at a time.
 */
const Tooltip = ({
  children,
  contentInHtml,
  ...options
}: {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  /** Close as soon as the pointer leaves the trigger, not on leaving the popup. */
  disableHoverableContent?: boolean
  /**
   * Content mounts only while a tooltip is open, so explanations kept in a
   * tooltip are invisible to crawlers and LLMs reading the server-rendered
   * HTML. This also renders the content as a visually hidden description of
   * the trigger. Use it only when the tooltip carries meaning not shown
   * elsewhere on the page. The copy renders where TooltipContent does, so it
   * does not work with TooltipPortal, which renders nothing while closed.
   */
  contentInHtml?: boolean
}) => {
  const id = useId()
  const controller = useTooltipController(options)
  const contentDescriptionId = contentInHtml ? `${id}-description` : undefined

  return (
    <TooltipTriggerContextProvider
      value={{ ...controller, contentId: id, contentDescriptionId }}
    >
      {children}
    </TooltipTriggerContextProvider>
  )
}

const TooltipTrigger = ({
  ref,
  asChild,
  disabledOnTouch,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  /**
   * A tap does what the trigger does, e.g. follows its link, and never opens
   * the tooltip.
   */
  disabledOnTouch?: boolean
}) => {
  // Whether the tooltip was open when the last touch or pen press began.
  const tapStartedOpen = useRef<boolean>(undefined)
  const pointer = useRef({ isDown: false, hasMoveOpened: false })
  const tooltip = useTooltipTriggerContext()
  const { open, contentId, contentDescriptionId } = tooltip

  if (props.disabled) {
    return props.children
  }

  // While open, the popup describes the trigger, so the HTML copy would make
  // screen readers read it twice.
  const describedBy = open
    ? joinIds(props['aria-describedby'], contentId)
    : (contentDescriptionId ?? props['aria-describedby'])

  // Touch has no hover, so the first tap opens the tooltip in place of the
  // trigger's own action, and a tap on the open tooltip closes it or follows
  // its link. This goes by the tap, not the width: an iPad in landscape is
  // as wide as a laptop, and a click in a narrow window must still follow a
  // link. A key press has no pointer down, so it keeps the trigger's action.
  const onTapPointerDown = (e: React.PointerEvent) => {
    // Recorded before the press closes an open tooltip.
    tapStartedOpen.current = e.pointerType === 'mouse' ? undefined : open
  }
  const onTapClick = (e: React.MouseEvent) => {
    const startedOpen = tapStartedOpen.current
    tapStartedOpen.current = undefined
    if (startedOpen !== false) return
    e.preventDefault()
    tooltip.setOpen(true)
  }

  const Element = asChild ? Slot : 'button'
  return (
    <Element
      data-role={disabledOnTouch ? undefined : 'tooltip-trigger'}
      data-state={tooltip.stateAttribute}
      {...props}
      aria-describedby={describedBy}
      ref={mergeRefs(ref, tooltip.triggerRef)}
      onPointerMove={compose(props.onPointerMove, (e) => {
        if (e.pointerType === 'touch' || pointer.current.hasMoveOpened) return
        pointer.current.hasMoveOpened = true
        tooltip.onTriggerEnter()
      })}
      onPointerLeave={compose(props.onPointerLeave, () => {
        pointer.current.hasMoveOpened = false
        tooltip.onTriggerLeave()
      })}
      onPointerDown={compose(
        disabledOnTouch
          ? props.onPointerDown
          : (props.onPointerDown ?? onTapPointerDown),
        () => {
          if (tooltip.open) tooltip.setOpen(false)
          pointer.current.isDown = true
          document.addEventListener(
            'pointerup',
            () => {
              pointer.current.isDown = false
            },
            { once: true },
          )
        },
      )}
      onFocus={compose(props.onFocus, () => {
        if (!pointer.current.isDown) tooltip.openNow()
      })}
      onBlur={compose(props.onBlur, () => tooltip.setOpen(false))}
      onClick={compose(
        disabledOnTouch ? props.onClick : (props.onClick ?? onTapClick),
        () => tooltip.setOpen(false),
      )}
    />
  )
}

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
  className,
  sideOffset = 8,
  fitContent,
  ...props
}: TooltipPopupProps & VariantProps<typeof tooltipContentVariants>) => {
  const tooltip = useTooltipTriggerContext()
  const inPortal = useContext(InPortalContext)
  const content = tooltip.isPresent && (
    <TooltipPopup
      tooltip={tooltip}
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
      {tooltip.contentDescriptionId && (
        // A span, unlike a div, is not split by the HTML parser when the
        // tooltip sits in phrasing content, so hydration stays consistent.
        <span id={tooltip.contentDescriptionId} className="sr-only">
          <InsideHtmlCopyContext value={true}>
            {props.children}
          </InsideHtmlCopyContext>
        </span>
      )}
      {inPortal ? <TooltipPortal>{content}</TooltipPortal> : content}
    </>
  )
}

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

/** Renders the open popup at the end of the body. Nothing on the server. */
const TooltipPortal = ({ children }: { children: React.ReactNode }) => {
  const { isPresent } = useTooltipTriggerContext()
  const canPortal = typeof document !== 'undefined'
  return isPresent && canPortal ? createPortal(children, document.body) : null
}

/** As in Radix: the caller's handler runs first, its preventDefault skips ours */
function compose<E extends React.SyntheticEvent>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event)
    if (!event.defaultPrevented) ours(event)
  }
}

function joinIds(...ids: (string | undefined)[]) {
  return ids.filter(Boolean).join(' ') || undefined
}

export {
  Tooltip,
  TooltipContent,
  TooltipHtmlCopyOnly,
  tooltipContentVariants,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
  TooltipsInPortal,
  TooltipVisualOnly,
}
