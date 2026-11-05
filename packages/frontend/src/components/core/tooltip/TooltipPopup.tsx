import {
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  type Placement,
  shift,
  useFloating,
} from '@floating-ui/react-dom'
import type React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { mergeRefs } from '~/utils/mergeRefs'
import type { TooltipTriggerContextValue } from './TooltipTriggerContext'

type Side = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'center' | 'end'
type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>

export type TooltipPopupProps = React.ComponentProps<'div'> & {
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
  avoidCollisions?: boolean
  collisionPadding?: number
  /** Hides the popup while its trigger is scrolled out of view. */
  hideWhenDetached?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
}

/**
 * The open popup, placed by Floating UI next to the trigger. It mounts only
 * while the tooltip is open or plays its closing animation, so a closed
 * tooltip costs nothing here. Placement, attributes and dismissal follow
 * Radix's tooltip, so the styles and props written for it still work.
 */
export function TooltipPopup({
  tooltip,
  ref,
  side = 'top',
  align = 'center',
  sideOffset = 0,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 0,
  hideWhenDetached = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  style,
  ...props
}: TooltipPopupProps & { tooltip: TooltipTriggerContextValue }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [zIndex, setZIndex] = useState<string>()
  const { setOpen, triggerRef } = tooltip

  const { refs, floatingStyles, placement, isPositioned, middlewareData } =
    useFloating({
      strategy: 'fixed',
      placement: (align === 'center' ? side : `${side}-${align}`) as Placement,
      elements: { reference: triggerRef.current },
      whileElementsMounted: autoUpdate,
      middleware: [
        offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
        avoidCollisions &&
          shift({
            mainAxis: true,
            crossAxis: false,
            limiter: limitShift(),
            padding: collisionPadding,
          }),
        avoidCollisions && flip({ padding: collisionPadding }),
        hideWhenDetached &&
          hide({ strategy: 'referenceHidden', padding: collisionPadding }),
      ],
    })
  const [placedSide, placedAlign = 'center'] = placement.split('-') as [
    Side,
    Align | undefined,
  ]

  // The wrapper is what stacks, so it takes the content's z-index class.
  useLayoutEffect(() => {
    if (contentRef.current)
      setZIndex(getComputedStyle(contentRef.current).zIndex)
  }, [])

  useDismiss(tooltip, contentRef, { onEscapeKeyDown, onPointerDownOutside })
  useCloseOnScroll(triggerRef, setOpen)
  useHoverGrace(tooltip, contentRef)
  usePresence(tooltip, contentRef)

  return (
    <div
      ref={refs.setFloating}
      // Other code finds open popups, Radix's and ours, by this attribute
      data-radix-popper-content-wrapper=""
      style={{
        ...floatingStyles,
        // Off screen until measured, so it never flashes at 0,0
        transform: isPositioned
          ? floatingStyles.transform
          : 'translate(0, -200%)',
        minWidth: 'max-content',
        zIndex,
        ...(middlewareData.hide?.referenceHidden && {
          visibility: 'hidden',
          pointerEvents: 'none',
        }),
      }}
    >
      <div
        role="tooltip"
        id={tooltip.contentId}
        data-state={tooltip.stateAttribute}
        data-side={placedSide}
        data-align={placedAlign}
        {...props}
        ref={mergeRefs(ref, contentRef)}
        style={
          {
            ...style,
            '--radix-tooltip-content-transform-origin': transformOrigin(
              placedSide,
              placedAlign,
            ),
            animation: isPositioned ? undefined : 'none',
          } as React.CSSProperties
        }
      />
    </div>
  )
}

/** The edge of the popup nearest the trigger, where it zooms from. */
function transformOrigin(side: Side, align: Align) {
  const along = { start: '0%', center: '50%', end: '100%' }[align]
  switch (side) {
    case 'top':
      return `${along} 100%`
    case 'bottom':
      return `${along} 0%`
    case 'left':
      return `100% ${along}`
    case 'right':
      return `0% ${along}`
  }
}

/** Escape and a press outside the popup close it. */
function useDismiss(
  tooltip: TooltipTriggerContextValue,
  contentRef: React.RefObject<HTMLElement | null>,
  handlers: Pick<TooltipPopupProps, 'onEscapeKeyDown' | 'onPointerDownOutside'>,
) {
  const latest = useRef(handlers)
  latest.current = handlers
  const { open, setOpen } = tooltip

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      latest.current.onEscapeKeyDown?.(event)
      if (!event.defaultPrevented) setOpen(false)
    }
    const onPointerDown = (originalEvent: PointerEvent) => {
      const target = originalEvent.target
      if (target instanceof Node && contentRef.current?.contains(target)) return
      const event: PointerDownOutsideEvent = new CustomEvent(
        'tooltip.pointerDownOutside',
        { cancelable: true, detail: { originalEvent } },
      )
      latest.current.onPointerDownOutside?.(event)
      if (!event.defaultPrevented) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    // Later, so the press that opened the tooltip does not close it
    const timer = window.setTimeout(() =>
      document.addEventListener('pointerdown', onPointerDown),
    )
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, setOpen, contentRef])
}

/** Scrolling anything that holds the trigger closes the popup. */
function useCloseOnScroll(
  triggerRef: React.RefObject<HTMLElement | null>,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    const onScroll = (event: Event) => {
      const trigger = triggerRef.current
      if (
        trigger &&
        event.target instanceof Node &&
        event.target.contains(trigger)
      ) {
        setOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, { capture: true })
    return () =>
      window.removeEventListener('scroll', onScroll, { capture: true })
  }, [triggerRef, setOpen])
}

/**
 * A hoverable popup stays open while the pointer crosses from the trigger to
 * it or back, within the box spanning where it left and where it heads.
 */
function useHoverGrace(
  tooltip: TooltipTriggerContextValue,
  contentRef: React.RefObject<HTMLElement | null>,
) {
  const { open, disableHoverableContent, triggerRef, setOpen } = tooltip
  useEffect(() => {
    const trigger = triggerRef.current
    const content = contentRef.current
    if (!open || disableHoverableContent || !trigger || !content) return

    let stopTracking = () => {}
    const onLeave = (event: PointerEvent, toward: HTMLElement) => {
      if (event.pointerType === 'touch') return
      stopTracking()
      const box = graceBox(event, toward.getBoundingClientRect())
      const onMove = (move: PointerEvent) => {
        const target = move.target
        if (
          target instanceof Node &&
          (trigger.contains(target) || content.contains(target))
        ) {
          stopTracking()
        } else if (!isInside(box, move)) {
          stopTracking()
          setOpen(false)
        }
      }
      document.addEventListener('pointermove', onMove)
      stopTracking = () => document.removeEventListener('pointermove', onMove)
    }
    const onTriggerLeave = (event: PointerEvent) => onLeave(event, content)
    const onContentLeave = (event: PointerEvent) => onLeave(event, trigger)
    trigger.addEventListener('pointerleave', onTriggerLeave)
    content.addEventListener('pointerleave', onContentLeave)
    return () => {
      stopTracking()
      trigger.removeEventListener('pointerleave', onTriggerLeave)
      content.removeEventListener('pointerleave', onContentLeave)
    }
  }, [open, disableHoverableContent, triggerRef, contentRef, setOpen])
}

type Box = { left: number; right: number; top: number; bottom: number }

function graceBox(exit: PointerEvent, toward: DOMRect): Box {
  const pad = 5
  return {
    left: Math.min(exit.clientX - pad, toward.left),
    right: Math.max(exit.clientX + pad, toward.right),
    top: Math.min(exit.clientY - pad, toward.top),
    bottom: Math.max(exit.clientY + pad, toward.bottom),
  }
}

function isInside(box: Box, { clientX: x, clientY: y }: PointerEvent) {
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom
}

/** Keeps the popup mounted after it closes, until its exit animation ends. */
function usePresence(
  tooltip: TooltipTriggerContextValue,
  contentRef: React.RefObject<HTMLElement | null>,
) {
  const { open, onExitComplete } = tooltip
  useLayoutEffect(() => {
    const content = contentRef.current
    if (open || !content) return
    const exitAnimation = getComputedStyle(content).animationName
    if (exitAnimation === 'none') {
      onExitComplete()
      return
    }
    const onEnd = (event: AnimationEvent) => {
      // Closing cancels the enter animation, which must not end the exit
      if (event.target !== content || event.animationName !== exitAnimation) {
        return
      }
      // React would unmount a frame later, and in that frame the popup is
      // back at full opacity. Holding the last keyframe hides that frame.
      content.style.animationFillMode = 'forwards'
      flushSync(onExitComplete)
    }
    content.addEventListener('animationend', onEnd)
    content.addEventListener('animationcancel', onEnd)
    return () => {
      content.removeEventListener('animationend', onEnd)
      content.removeEventListener('animationcancel', onEnd)
    }
  }, [open, onExitComplete, contentRef])
}
