import { Tooltip as Base } from '@base-ui/react/tooltip'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import {
  createContext,
  isValidElement,
  useContext,
  useId,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/utils/cn'
import {
  type PointerDownOutsideEvent,
  type TooltipContentOptions,
  type TooltipHandle,
  type TooltipSlot,
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './TooltipTriggerContext'

const TooltipHandleContext = createContext<TooltipHandle | null>(null)

/**
 * Owns the one popup that every tooltip inside it shows in. Each tooltip
 * only renders a trigger, so a table with hundreds of them mounts one
 * popup, not hundreds.
 */
const TooltipProvider = ({
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  children,
}: {
  delayDuration?: number
  skipDelayDuration?: number
  /** Close as soon as the pointer leaves the trigger, not on leaving the popup. */
  disableHoverableContent?: boolean
  children: React.ReactNode
}) => {
  const [handle] = useState(() => Base.createHandle<TooltipSlot>())
  const [activeSlot, setActiveSlot] = useState<TooltipSlot>()
  const activeSlotRef = useRef(activeSlot)
  activeSlotRef.current = activeSlot

  return (
    <TooltipHandleContext value={handle}>
      <Base.Provider delay={delayDuration} timeout={skipDelayDuration}>
        {children}
        <Base.Root
          handle={handle}
          onOpenChange={(next, details) => {
            const onPointerDownOutside =
              activeSlotRef.current?.options.current?.onPointerDownOutside
            if (
              !next &&
              details.reason === 'outside-press' &&
              onPointerDownOutside
            ) {
              const event: PointerDownOutsideEvent = new CustomEvent(
                'tooltip.pointerDownOutside',
                { cancelable: true, detail: { originalEvent: details.event } },
              )
              onPointerDownOutside(event)
              if (event.defaultPrevented) details.cancel()
            }
          }}
          disableHoverablePopup={
            activeSlot?.disableHoverableContent ?? disableHoverableContent
          }
        >
          {({ payload }) =>
            payload && <SharedPopup slot={payload} onShow={setActiveSlot} />
          }
        </Base.Root>
      </Base.Provider>
    </TooltipHandleContext>
  )
}

function SharedPopup({
  slot,
  onShow,
}: {
  slot: TooltipSlot
  onShow: (slot: TooltipSlot) => void
}) {
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  useLayoutEffect(() => {
    onShow(slot)
    slot.rerenderPopup = rerender
    return () => {
      slot.rerenderPopup = undefined
    }
  }, [slot, onShow])
  const options = slot.options.current
  if (!options) return null
  return (
    <Base.Portal>
      <StackingPositioner
        side={options.side}
        align={options.align}
        sideOffset={options.sideOffset}
        alignOffset={options.alignOffset}
        collisionPadding={options.collisionPadding}
        collisionAvoidance={
          options.avoidCollisions ? undefined : { side: 'none', align: 'none' }
        }
        className={cn(
          options.hideWhenDetached && 'data-anchor-hidden:invisible',
        )}
      >
        <Base.Popup
          {...options.popupProps}
          ref={slot.setContainer}
          id={slot.contentId}
          role="tooltip"
          className={options.className}
        />
      </StackingPositioner>
    </Base.Portal>
  )
}

const Tooltip = ({
  children,
  contentInHtml,
  delayDuration,
  disableHoverableContent,
}: {
  children: React.ReactNode
  delayDuration?: number
  /** Close as soon as the pointer leaves the trigger, not on leaving the popup. */
  disableHoverableContent?: boolean
  /**
   * The popup renders only while open, so explanations kept in a tooltip are
   * invisible to crawlers and LLMs reading the server-rendered HTML. This
   * also renders the content as a visually hidden description of the
   * trigger. Use it only when the tooltip carries meaning not shown
   * elsewhere on the page.
   */
  contentInHtml?: boolean
}) => {
  const handle = useContext(TooltipHandleContext)
  if (!handle) throw new Error('Tooltip must be used within a TooltipProvider')
  const id = useId()
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const options = useRef<TooltipContentOptions>(undefined)
  const [slot] = useState<TooltipSlot>(() => ({
    contentId: `${id}-popup`,
    disableHoverableContent,
    options,
    setContainer,
    rerenderPopup: undefined,
  }))

  return (
    <TooltipTriggerContextProvider
      value={{
        handle,
        triggerId: `${id}-trigger`,
        slot,
        container,
        delay: delayDuration,
        contentDescriptionId: contentInHtml ? `${id}-description` : undefined,
      }}
    >
      {children}
    </TooltipTriggerContextProvider>
  )
}

const TooltipTrigger = ({
  asChild,
  disabledOnTouch,
  children,
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
  const tooltip = useTooltipTriggerContext()
  const open = tooltip.container !== null

  if (props.disabled) {
    return children
  }

  // While open, the popup describes the trigger, so the HTML copy would make
  // screen readers read it twice. Base UI leaves describing to us.
  const describedBy = open
    ? [props['aria-describedby'], tooltip.slot.contentId]
        .filter(Boolean)
        .join(' ')
    : (tooltip.contentDescriptionId ?? props['aria-describedby'])

  // Touch has no hover, so the first tap opens the tooltip in place of the
  // trigger's own action, and a tap on the open tooltip closes it or follows
  // its link. This goes by the tap, not the width: an iPad in landscape is
  // as wide as a laptop, and a click in a narrow window must still follow a
  // link. A key press has no pointer down, so it keeps the trigger's action.
  const tapHandlers = !disabledOnTouch && {
    'data-role': 'tooltip-trigger',
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      tapStartedOpen.current = e.pointerType === 'mouse' ? undefined : open
    },
    onClick: (
      e: React.MouseEvent<HTMLButtonElement> & {
        preventBaseUIHandler?: () => void
      },
    ) => {
      const startedOpen = tapStartedOpen.current
      tapStartedOpen.current = undefined
      if (startedOpen !== false) return
      e.preventDefault()
      e.preventBaseUIHandler?.()
      tooltip.handle.open(tooltip.triggerId)
    },
  }

  return (
    <Base.Trigger
      handle={tooltip.handle}
      payload={tooltip.slot}
      id={tooltip.triggerId}
      delay={tooltip.delay}
      data-state={open ? 'open' : 'closed'}
      {...tapHandlers}
      {...props}
      aria-describedby={describedBy}
      render={asChild && isValidElement(children) ? children : undefined}
    >
      {asChild ? undefined : children}
    </Base.Trigger>
  )
}

/** The tooltip's look, without its open and close animation. */
const tooltipSurfaceClassName =
  'z-110 rounded-lg border border-divider bg-surface-primary p-3 text-left font-medium text-paragraph-13 text-primary normal-case max-sm:max-w-screen dark:bg-header-secondary'

// A modal dialog turns off pointer events on the body, which the popup is
// portaled into, so the popup turns them back on to stay hoverable.
const tooltipContentVariants = cva(
  `fade-in-0 zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--transform-origin) animate-in data-closed:animate-out data-instant:animate-none pointer-events-auto ${tooltipSurfaceClassName}`,
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

/** Stacks the tooltips inside it above dialogs. */
function TooltipsInPortal({ children }: { children: React.ReactNode }) {
  return <InPortalContext value={true}>{children}</InPortalContext>
}

const TooltipContent = ({
  className,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  alignOffset,
  collisionPadding = 0,
  avoidCollisions = true,
  hideWhenDetached,
  onPointerDownOutside,
  fitContent,
  children,
  ...popupProps
}: React.ComponentProps<'div'> &
  VariantProps<typeof tooltipContentVariants> & {
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alignOffset?: number
    collisionPadding?: number
    avoidCollisions?: boolean
    /** Hides the popup while its trigger is scrolled out of view. */
    hideWhenDetached?: boolean
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  }) => {
  const tooltip = useTooltipTriggerContext()
  const inPortal = useContext(InPortalContext)
  const options: TooltipContentOptions = {
    className: tooltipContentVariants({
      fitContent,
      className: cn(inPortal && 'z-1000', className),
    }),
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    avoidCollisions,
    hideWhenDetached,
    onPointerDownOutside,
    popupProps,
  }
  // The shared popup reads these options in its own tree, so it renders
  // again when they change, or drops its surface when the content goes.
  useLayoutEffect(() => {
    tooltip.slot.options.current = options
    tooltip.slot.rerenderPopup?.()
  })
  useLayoutEffect(() => {
    const slot = tooltip.slot
    return () => {
      slot.options.current = undefined
      slot.rerenderPopup?.()
    }
  }, [tooltip.slot])

  return (
    <>
      {tooltip.contentDescriptionId && (
        // A span, unlike a div, is not split by the HTML parser when the
        // tooltip sits in phrasing content, so hydration stays consistent.
        <span id={tooltip.contentDescriptionId} className="sr-only">
          <InsideHtmlCopyContext value={true}>{children}</InsideHtmlCopyContext>
        </span>
      )}
      {tooltip.container && createPortal(children, tooltip.container)}
    </>
  )
}

/**
 * The positioner is what stacks, so it takes the popup's z-index, which
 * callers set through the popup's class.
 */
function StackingPositioner({
  children,
  ...props
}: React.ComponentProps<typeof Base.Positioner>) {
  const ref = useRef<HTMLDivElement>(null)
  const [zIndex, setZIndex] = useState<string>()
  // The shared popup changes look with each tooltip, so this reads it after
  // every render. Setting the same value does not render again.
  useLayoutEffect(() => {
    const popup = ref.current?.firstElementChild
    if (popup) setZIndex(getComputedStyle(popup).zIndex)
  })
  return (
    <Base.Positioner ref={ref} style={{ zIndex }} {...props}>
      {children}
    </Base.Positioner>
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

/** The popup always renders in a portal, so this only groups its parts. */
const TooltipPortal = ({ children }: { children: React.ReactNode }) => children

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
