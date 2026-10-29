import {
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export const TOOLTIP_OFFSET = 16
/** The least room left between a tooltip and the window's edge. */
const TOOLTIP_WINDOW_MARGIN = 8

/** A point in the root's pixels. */
export interface Anchor {
  x: number
  y: number
}

export interface ActiveItem extends Anchor {
  index: number
}

interface Options {
  count: number
  /** Where an item's tooltip hangs from when the keyboard selects it. */
  anchorOf: (index: number) => Anchor
  /** The tooltip's top-left corner; the window keeps it from leaving. */
  place: (anchor: Anchor, tooltip: { width: number; height: number }) => Anchor
  /** The arrow keys go round instead of stopping at the ends. */
  wrap?: boolean
  /**
   * The tooltip may not hang below the root: on a phone a tap leaves it over
   * the next section as the page scrolls, and iOS Safari cuts it off at that
   * section's edge. Its `ChartTooltipRows` shrink to fit and scroll.
   */
  fitHeight?: boolean
  /** The keys that step between items; left and right by default. */
  arrowKeys?: 'leftRight' | 'upDown'
  /** Called when the user selects an item or closes the tooltip. */
  onSelect?: (index: number | null) => void
  /**
   * Charts that show their hover together: a tap on, or focus moving to,
   * one of them selects a row in this one too, so it does not close this
   * tooltip.
   */
  syncId?: string
}

/**
 * The hovered item of a chart and its tooltip, shared by every chart: the
 * pointer and the keyboard select items, a lifted finger keeps the tooltip
 * until a tap elsewhere, and moves within an item only move the tooltip,
 * without a React render.
 */
export function useChartTooltip({
  count,
  anchorOf,
  place,
  wrap = false,
  fitHeight = false,
  arrowKeys = 'leftRight',
  onSelect,
  syncId,
}: Options) {
  const [active, setActive] = useState<ActiveItem | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const placeRef = useRef(place)
  // Committed renders only; pointer events read it between renders.
  useLayoutEffect(() => {
    placeRef.current = place
  })

  function placeTooltip(anchor: Anchor) {
    const tooltip = tooltipRef.current
    const root = rootRef.current
    if (!tooltip || !root) return
    const bottom = root.clientHeight
    if (fitHeight) fitRows(tooltip, bottom)
    const width = tooltip.offsetWidth
    const height = tooltip.offsetHeight
    let { x: left, y: top } = placeRef.current(anchor, { width, height })
    if (fitHeight) top = Math.min(top, Math.max(0, bottom - height))
    const rootLeft = root.getBoundingClientRect().left
    const max = document.documentElement.clientWidth - TOOLTIP_WINDOW_MARGIN
    if (rootLeft + left + width > max) left = max - width - rootLeft
    if (rootLeft + left < TOOLTIP_WINDOW_MARGIN) {
      left = TOOLTIP_WINDOW_MARGIN - rootLeft
    }
    tooltip.style.transform = `translate(${left}px, ${top}px)`
  }

  // New content is measured and placed after React renders it, before the
  // frame is painted.
  // biome-ignore lint/correctness/useExhaustiveDependencies: placeTooltip reads refs
  useLayoutEffect(() => {
    if (active) placeTooltip(active)
  }, [active])

  /** Inside this chart or one it shows its hover with. */
  function isOwn(target: EventTarget | null) {
    if (!(target instanceof Element)) return false
    if (rootRef.current?.contains(target)) return true
    return (
      !!syncId && !!target.closest(`[data-chart-sync="${CSS.escape(syncId)}"]`)
    )
  }

  // Not every browser focuses on tap, so blur alone cannot close a touch
  // tooltip.
  const isActive = active !== null
  // biome-ignore lint/correctness/useExhaustiveDependencies: isOwn reads a ref and syncId
  useEffect(() => {
    if (!isActive) return
    const closeOutside = (event: globalThis.PointerEvent) => {
      if (!isOwn(event.target)) setActive(null)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [isActive, syncId])

  function select(index: number, anchor: Anchor) {
    if (index === active?.index) {
      placeTooltip(anchor)
      return
    }
    setActive({ index, ...anchor })
    onSelect?.(index)
  }

  function clear() {
    setActive(null)
    onSelect?.(null)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && active) {
      event.preventDefault()
      clear()
      return
    }
    // Modified arrows are the browser's, e.g. Alt+Left goes back.
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return
    }
    if (count === 0) return
    const last = count - 1
    let index: number
    if (event.key === 'Home') index = 0
    else if (event.key === 'End') index = last
    else {
      const forward = arrowKeys === 'upDown' ? 'ArrowDown' : 'ArrowRight'
      const back = arrowKeys === 'upDown' ? 'ArrowUp' : 'ArrowLeft'
      const step = event.key === forward ? 1 : event.key === back ? -1 : 0
      if (step === 0) return
      // The first press starts from the end it points away from.
      const from = active ? active.index : step > 0 ? -1 : count
      index = wrap
        ? (from + step + count) % count
        : Math.min(last, Math.max(0, from + step))
    }
    event.preventDefault()
    select(index, anchorOf(index))
  }

  return {
    active,
    /** Shows an item without telling `onSelect`, e.g. for a synced chart. */
    setActive,
    select,
    clear,
    rootRef,
    /** For the element the user points at and focuses. */
    interactiveProps: {
      role: 'application',
      tabIndex: 0,
      'data-chart-hover': '',
      'data-chart-sync': syncId,
      onKeyDown,
      onBlur: (event: { relatedTarget: EventTarget | null }) => {
        if (!isOwn(event.relatedTarget)) clear()
      },
      onPointerLeave: (event: PointerEvent) => {
        // A lifted finger also leaves; its tooltip stays until a tap
        // elsewhere.
        if (event.pointerType !== 'touch') clear()
      },
      // A swipe that turns into a scroll is cancelled, not a tap.
      onPointerCancel: clear,
    },
    tooltipProps: {
      ref: tooltipRef,
      'data-chart-tooltip': '',
      className: 'pointer-events-none absolute top-0 left-0 z-110',
      style: { visibility: active ? 'visible' : 'hidden' },
    } as const,
  }
}

/**
 * Cuts scrolling rows to leave the tooltip no taller than `height`. Touches
 * reach a tooltip only while its rows scroll; otherwise they go through to
 * the chart.
 */
function fitRows(tooltip: HTMLElement, height: number) {
  const rows = tooltip.querySelector<HTMLElement>('[data-chart-tooltip-rows]')
  if (!rows) return
  const rest = tooltip.offsetHeight - rows.offsetHeight
  rows.style.maxHeight = `${height - rest}px`
  tooltip.style.pointerEvents =
    rows.scrollHeight > rows.clientHeight ? 'auto' : 'none'
}

/**
 * Below and right of the anchor, or left of it past the middle of the plot.
 */
export function placeBeside(plot: { x: number; width: number }) {
  return (anchor: Anchor, tooltip: { width: number }): Anchor => ({
    x:
      anchor.x > plot.x + plot.width / 2
        ? anchor.x - TOOLTIP_OFFSET - tooltip.width
        : anchor.x + TOOLTIP_OFFSET,
    y: anchor.y + TOOLTIP_OFFSET,
  })
}
