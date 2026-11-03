import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

/**
 * Tables render a tooltip per cell, hardly any of which is ever opened, and
 * hydrating Radix's tree for each one was a large share of a table page's
 * hydration. So a tooltip renders the markup Radix renders while closed and
 * mounts Radix the first time it opens or takes focus.
 *
 * Mounting Radix puts its components above the trigger, so React replaces
 * the trigger's DOM node. Until then this module times hover the way Radix
 * does, and it moves focus over to the new node.
 */

export type RadixOnFirstUse = {
  /** Until the tooltip first opens or takes focus, it renders without Radix. */
  isRadixMounted: boolean
  triggerRef: React.RefObject<HTMLButtonElement | null>
  openAfterHoverDelay: () => void
  cancelHoverOpen: () => void
  /** Radix opens a tooltip on focus itself, once the focus moves over. */
  mountRadixOnFocus: () => void
  rememberFocusIn: (trigger: HTMLElement | null) => void
  restoreFocusIn: (trigger: HTMLElement | null) => void
}

export function useRadixOnFirstUse({
  isOpen,
  delayDuration,
  onOpenChange,
}: {
  isOpen: boolean
  delayDuration: number | undefined
  onOpenChange: (open: boolean) => void
}): RadixOnFirstUse {
  const hoverDelay = useHoverDelay()
  const [isRadixMounted, setIsRadixMounted] = useState(isOpen)
  if (isOpen && !isRadixMounted) setIsRadixMounted(true)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const hoverTimerRef = useRef(0)
  const focusRef = useRef<FocusInTrigger>(undefined)

  const cancelHoverOpen = () => {
    window.clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = 0
  }

  return {
    isRadixMounted,
    triggerRef,
    openAfterHoverDelay: () => {
      const wait = hoverDelay.isOpenDelayedRef.current
        ? (delayDuration ?? hoverDelay.delayDuration)
        : 0
      hoverTimerRef.current = window.setTimeout(() => {
        hoverTimerRef.current = 0
        closeOtherTooltips()
        onOpenChange(true)
        closeIfPointerLeavesUnseen(triggerRef, () => onOpenChange(false))
      }, wait)
    },
    cancelHoverOpen,
    mountRadixOnFocus: () => {
      cancelHoverOpen()
      setIsRadixMounted(true)
    },
    rememberFocusIn: (trigger) => {
      focusRef.current = findFocus(trigger)
    },
    restoreFocusIn: (trigger) => {
      moveFocus(trigger, focusRef.current)
      focusRef.current = undefined
    },
  }
}

/**
 * Mounting Radix replaces the trigger's DOM node. The plain trigger notes
 * where focus is before its node leaves the document, and the trigger Radix
 * renders puts it back.
 */
export function useKeepFocusAcrossRadixMount(tooltip: RadixOnFirstUse) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: each trigger mounts once, as plain or as Radix
  useLayoutEffect(() => {
    const node = tooltip.triggerRef.current
    if (tooltip.isRadixMounted) {
      tooltip.restoreFocusIn(node)
      return
    }
    return () => {
      tooltip.cancelHoverOpen()
      tooltip.rememberFocusIn(node)
    }
  }, [])
}

// Radix's defaults, kept by TooltipProvider
export const DEFAULT_DELAY_DURATION = 700
export const DEFAULT_SKIP_DELAY_DURATION = 300

type HoverDelay = {
  delayDuration: number
  /** Off while a tooltip is open and for skipDelayDuration after it closes. */
  isOpenDelayedRef: React.RefObject<boolean>
  noteOpenChange: (open: boolean) => void
}

const HoverDelayContext = createContext<HoverDelay>({
  delayDuration: DEFAULT_DELAY_DURATION,
  isOpenDelayedRef: { current: true },
  noteOpenChange: () => {},
})

export function useHoverDelay() {
  return useContext(HoverDelayContext)
}

/**
 * Radix's provider skips the hover delay right after another tooltip was
 * open. It only sees the tooltips Radix runs, so this tracks the same for the
 * ones it does not run yet.
 */
export function HoverDelayProvider({
  delayDuration,
  skipDelayDuration,
  children,
}: {
  delayDuration: number
  skipDelayDuration: number
  children: React.ReactNode
}) {
  const isOpenDelayedRef = useRef(true)
  const skipDelayTimerRef = useRef(0)
  useEffect(() => () => window.clearTimeout(skipDelayTimerRef.current), [])

  const value = useMemo<HoverDelay>(
    () => ({
      delayDuration,
      isOpenDelayedRef,
      noteOpenChange: (open) => {
        if (skipDelayDuration <= 0) return
        window.clearTimeout(skipDelayTimerRef.current)
        if (open) {
          isOpenDelayedRef.current = false
        } else {
          skipDelayTimerRef.current = window.setTimeout(() => {
            isOpenDelayedRef.current = true
          }, skipDelayDuration)
        }
      },
    }),
    [delayDuration, skipDelayDuration],
  )

  return <HoverDelayContext value={value}>{children}</HoverDelayContext>
}

/** Radix's own event: every open tooltip closes when another one opens. */
function closeOtherTooltips() {
  document.dispatchEvent(new CustomEvent('tooltip.open'))
}

/**
 * The new trigger node gets no pointerleave if the pointer leaves it without
 * moving over it first, as WebKit still counts the pointer as over the old
 * node. So the first move after the swap decides.
 */
function closeIfPointerLeavesUnseen(
  triggerRef: React.RefObject<HTMLElement | null>,
  close: () => void,
) {
  const onMove = (event: PointerEvent) => {
    document.removeEventListener('pointermove', onMove, true)
    const target = event.target
    if (!(target instanceof Element)) return
    const isOverTooltip =
      triggerRef.current?.contains(target) ||
      target.closest('[data-radix-popper-content-wrapper]')
    if (!isOverTooltip) close()
  }
  document.addEventListener('pointermove', onMove, true)
}

/** Where focus sits inside a trigger, as child indexes from the trigger. */
type FocusInTrigger = { path: number[]; focusVisible: boolean }

function findFocus(trigger: HTMLElement | null): FocusInTrigger | undefined {
  const focused = document.activeElement
  if (!trigger || !focused || !trigger.contains(focused)) return

  const path: number[] = []
  for (let node = focused; node !== trigger; ) {
    const parent: HTMLElement | null = node.parentElement
    if (!parent) return
    path.unshift(Array.prototype.indexOf.call(parent.children, node))
    node = parent
  }
  return { path, focusVisible: focused.matches(':focus-visible') }
}

function moveFocus(
  trigger: HTMLElement | null,
  focus: FocusInTrigger | undefined,
) {
  if (!trigger || !focus) return
  let node: Element | undefined = trigger
  for (const index of focus.path) node = node?.children[index]
  if (node instanceof HTMLElement || node instanceof SVGElement) {
    // A ring only if the old node showed one, e.g. it got focus from a key
    node.focus({ preventScroll: true, focusVisible: focus.focusVisible })
  }
}
