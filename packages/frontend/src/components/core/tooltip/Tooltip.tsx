import { Slot } from '@radix-ui/react-slot'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type React from 'react'
import { createContext, useContext, useId, useRef, useState } from 'react'
import { mergeRefs } from '~/utils/mergeRefs'
import {
  DEFAULT_DELAY_DURATION,
  DEFAULT_SKIP_DELAY_DURATION,
  HoverDelayProvider,
  type RadixOnFirstUse,
  useHoverDelay,
  useKeepFocusAcrossRadixMount,
  useRadixOnFirstUse,
} from './radixOnFirstUse'
import {
  TooltipTriggerContextProvider,
  useTooltipTriggerContext,
} from './TooltipTriggerContext'

const TooltipProvider = ({
  delayDuration = DEFAULT_DELAY_DURATION,
  skipDelayDuration = DEFAULT_SKIP_DELAY_DURATION,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <HoverDelayProvider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
  >
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      {...props}
    />
  </HoverDelayProvider>
)

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
  const isOpen = props.open ?? open
  const id = useId()
  const contentDescriptionId = contentInHtml ? `${id}-description` : undefined
  const { noteOpenChange } = useHoverDelay()
  const changeOpen = (next: boolean) => {
    setOpen(next)
    noteOpenChange(next)
    props.onOpenChange?.(next)
  }
  const radix = useRadixOnFirstUse({
    isOpen,
    delayDuration: props.delayDuration,
    onOpenChange: changeOpen,
  })

  const triggerContext = (
    <TooltipTriggerContextProvider
      value={{ open: isOpen, setOpen, contentDescriptionId, ...radix }}
    >
      {children}
    </TooltipTriggerContextProvider>
  )
  if (!radix.isRadixMounted) return triggerContext
  return (
    <TooltipPrimitive.Root {...props} open={isOpen} onOpenChange={changeOpen}>
      {triggerContext}
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
  // Whether the tooltip was open when the last touch or pen press began.
  const tapStartedOpen = useRef<boolean>(undefined)
  const plainTriggerState = useRef<PlainTriggerState>({
    hasHoverStarted: false,
    isPressed: false,
  })
  const tooltip = useTooltipTriggerContext()
  const { open, setOpen, contentDescriptionId, triggerRef } = tooltip
  useKeepFocusAcrossRadixMount(tooltip)
  // While open, Radix adds the id of its own copy of the same content, so the
  // HTML copy would make screen readers read it twice.
  const describedBy = open ? undefined : contentDescriptionId

  if (props.disabled) {
    return props.children
  }

  const renderTrigger = (triggerProps: TriggerProps) =>
    tooltip.isRadixMounted ? (
      <TooltipPrimitive.Trigger {...triggerProps} />
    ) : (
      renderPlainTrigger(triggerProps, tooltip, plainTriggerState.current)
    )

  // Radix opens a tooltip on hover and focus only, never on a tap
  if (disabledOnTouch) {
    return renderTrigger({
      ref: mergeRefs(ref, triggerRef),
      'aria-describedby': describedBy,
      ...props,
    })
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

  return renderTrigger({
    ref: mergeRefs(ref, triggerRef),
    onPointerDown,
    onClick,
    'data-role': 'tooltip-trigger',
    'aria-describedby': describedBy,
    ...props,
  })
}
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

type TriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger> & {
  'data-role'?: string
}
type PlainTriggerState = { hasHoverStarted: boolean; isPressed: boolean }

/**
 * What TooltipPrimitive.Trigger renders while closed, so nothing on screen
 * changes when Radix takes over. It opens the tooltip as Radix would: once
 * per hover after the delay, and on focus that does not come from a press.
 */
function renderPlainTrigger(
  { asChild, ...props }: TriggerProps,
  tooltip: RadixOnFirstUse,
  state: PlainTriggerState,
) {
  const Element = asChild ? Slot : 'button'
  return (
    <Element
      data-state="closed"
      {...props}
      onPointerMove={composeEventHandlers(props.onPointerMove, (e) => {
        if (e.pointerType === 'touch' || state.hasHoverStarted) return
        state.hasHoverStarted = true
        tooltip.openAfterHoverDelay()
      })}
      onPointerLeave={composeEventHandlers(props.onPointerLeave, () => {
        state.hasHoverStarted = false
        tooltip.cancelHoverOpen()
      })}
      onPointerDown={composeEventHandlers(props.onPointerDown, () => {
        tooltip.cancelHoverOpen()
        state.isPressed = true
        document.addEventListener(
          'pointerup',
          () => {
            state.isPressed = false
          },
          { once: true },
        )
      })}
      onFocus={composeEventHandlers(props.onFocus, () => {
        if (!state.isPressed) tooltip.mountRadixOnFocus()
      })}
      onClick={composeEventHandlers(props.onClick, tooltip.cancelHoverOpen)}
    />
  )
}

/** As in Radix: the caller's handler runs first, its preventDefault skips ours */
function composeEventHandlers<E extends React.SyntheticEvent>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event)
    if (!event.defaultPrevented) ours(event)
  }
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

const TooltipContent = ({
  ref,
  className,
  sideOffset = 8,
  fitContent,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>) => {
  const { contentDescriptionId, isRadixMounted } = useTooltipTriggerContext()

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
      {isRadixMounted && (
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={tooltipContentVariants({ fitContent, className })}
          {...props}
        />
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

const TooltipPortal = (
  props: React.ComponentProps<typeof TooltipPrimitive.Portal>,
) => {
  const { isRadixMounted } = useTooltipTriggerContext()
  return isRadixMounted ? <TooltipPrimitive.Portal {...props} /> : null
}
TooltipPortal.displayName = TooltipPrimitive.Portal.displayName

export {
  Tooltip,
  TooltipContent,
  TooltipHtmlCopyOnly,
  tooltipContentVariants,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
  TooltipVisualOnly,
}
