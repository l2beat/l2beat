import type { Tooltip as Base } from '@base-ui/react/tooltip'
import { createContext, useContext } from 'react'

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: Event }>

export type TooltipContentOptions = {
  className: string
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
  sideOffset: number
  alignOffset: number | undefined
  collisionPadding: number
  avoidCollisions: boolean
  hideWhenDetached: boolean | undefined
  onPointerDownOutside: ((event: PointerDownOutsideEvent) => void) | undefined
  popupProps: React.ComponentProps<'div'>
}

/**
 * What a tooltip hands the page's shared popup while it is open: where the
 * popup should sit and how it looks. The content itself stays in the
 * tooltip's own tree and is portaled into the popup, so it keeps the
 * React context of the cell it was written in.
 */
export type TooltipSlot = {
  contentId: string
  disableHoverableContent: boolean | undefined
  options: React.RefObject<TooltipContentOptions | undefined>
  setContainer: (element: HTMLElement | null) => void
}

export type TooltipHandle = Base.Handle<TooltipSlot>

type TooltipTriggerContextValue = {
  handle: TooltipHandle
  triggerId: string
  slot: TooltipSlot
  /** The shared popup's element while this tooltip is shown in it. */
  container: HTMLElement | null
  /** The trigger's own hover delay, if not the provider's. */
  delay: number | undefined
  /** Present only when the tooltip opted into contentInHtml. */
  contentDescriptionId: string | undefined
}

const TooltipTriggerContext = createContext<TooltipTriggerContextValue | null>(
  null,
)

export const TooltipTriggerContextProvider = TooltipTriggerContext.Provider

export function useTooltipTriggerContext() {
  const context = useContext(TooltipTriggerContext)
  if (!context) {
    throw new Error(
      'useTooltipTriggerContext must be used within a TooltipTriggerContextProvider',
    )
  }
  return context
}
