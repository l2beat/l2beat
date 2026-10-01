import { type RefObject, useLayoutEffect, useRef } from 'react'
import {
  getPinnedLeftVariable,
  PINNED_CELL_ATTRIBUTE,
  STICKY_OVERLAP_PX,
} from './utils/commonPinningStyles'

const READY_ATTRIBUTE = 'data-sticky-table-ready'
const HEIGHT_VARIABLE = '--sticky-table-header-height'
const BOTTOM_GAP_VARIABLE = '--sticky-table-header-bottom-gap'
const MAX_SCROLL_VARIABLE = '--sticky-table-max-scroll'
const SCROLL_VARIABLE = '--sticky-table-scroll'
const PINNED_WIDTH_VARIABLE = '--sticky-table-pinned-width'
const VARIABLES = [
  HEIGHT_VARIABLE,
  BOTTOM_GAP_VARIABLE,
  MAX_SCROLL_VARIABLE,
  SCROLL_VARIABLE,
  PINNED_WIDTH_VARIABLE,
]

export const stickyTableHeaderClassNames = {
  root: 'sticky-table',
  scroller: 'sticky-table-scroller',
  header: 'sticky-table-header',
  track: 'sticky-table-header-track',
  pinnedLayer: 'sticky-table-header-pinned-layer',
}

/** The elements the caller renders and attaches these refs to. */
export interface StickyTableRefs {
  /** Wraps the copy and the scroller; carries the layout variables. */
  root: RefObject<HTMLDivElement | null>
  scroller: RefObject<HTMLDivElement | null>
  table: RefObject<HTMLTableElement | null>
  /** The copy in the sliding track and in the pinned layer. */
  track: RefObject<HTMLTableElement | null>
  pinned: RefObject<HTMLTableElement | null>
}

/**
 * Keeps a table header in view while the table scrolls under the top of the
 * viewport, without ever trailing the scroll.
 *
 * `position: sticky` cannot do it on the table's own `thead`: the table sits in
 * a horizontal scroller, and that scroller (not the page) becomes the box the
 * header sticks to. Moving the header from a scroll listener, or from an
 * animation tracking the page, runs frames behind touch scrolling on iOS. So
 * the real `thead` stays in the table, invisible, to size the columns, and a
 * copy outside the scroller (`StickyTableHeader`) is shown in its place:
 *
 * - Vertically the copy is natively sticky, the same compositor path as the
 *   directory tabs above it, so it cannot drift from them.
 * - Horizontally it slides with a scroll-driven animation on the scroller's
 *   timeline, which WebKit and Chromium run on the compositor in the same
 *   frame as the scroll. The scroller does not rubber-band, because the
 *   timeline stops at the scroll edges and the header would stay behind.
 *
 * This hook copies the real column widths onto the copy and feeds
 * `sticky-table.css` the lengths it cannot know. Until it has, the copy stays
 * hidden and the real header shows, so the server-rendered HTML looks
 * unchanged.
 *
 * Call it in the component that renders all the elements: a parent's layout
 * effect runs once every child's ref is attached.
 */
export function useStickyTableHeader(enabled: boolean): StickyTableRefs {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const trackRef = useRef<HTMLTableElement>(null)
  const pinnedRef = useRef<HTMLTableElement>(null)

  useLayoutEffect(() => {
    if (!enabled) return
    const root = rootRef.current
    const scroller = scrollerRef.current
    const table = tableRef.current
    const thead = table?.tHead
    const track = trackRef.current
    const pinned = pinnedRef.current
    if (!root || !scroller || !table || !thead || !track || !pinned) return

    let pinnedVariables: string[] = []
    const update = () => {
      const widths = getColumnCells(table).map(
        (cell) => cell.getBoundingClientRect().width,
      )
      const isAligned = [track, pinned].every((copy) =>
        alignColumns(table, copy, widths),
      )
      root.toggleAttribute(READY_ATTRIBUTE, isAligned)
      if (!isAligned) return
      publishLayout(root, scroller, table, thead)
      pinnedVariables = publishPinnedColumns(root, table, widths)
    }

    const resizeObserver = new ResizeObserver(update)
    const observeLayout = () => {
      resizeObserver.disconnect()
      resizeObserver.observe(root)
      resizeObserver.observe(scroller)
      resizeObserver.observe(table)
      for (const cell of getColumnCells(table)) {
        resizeObserver.observe(cell)
      }
    }
    // Hiding or reordering columns swaps the header cells being observed.
    const mutationObserver = new MutationObserver(() => {
      observeLayout()
      update()
    })
    mutationObserver.observe(thead, { childList: true, subtree: true })
    observeLayout()
    update()

    const followScroll = () => {
      setVariable(root, SCROLL_VARIABLE, scroller.scrollLeft)
    }
    const needsScrollFallback = !CSS.supports('animation-timeline', 'scroll()')
    if (needsScrollFallback) {
      followScroll()
      scroller.addEventListener('scroll', followScroll, { passive: true })
    }

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      scroller.removeEventListener('scroll', followScroll)
      root.removeAttribute(READY_ATTRIBUTE)
      for (const variable of [...VARIABLES, ...pinnedVariables]) {
        root.style.removeProperty(variable)
      }
    }
  }, [enabled])

  return {
    root: rootRef,
    scroller: scrollerRef,
    table: tableRef,
    track: trackRef,
    pinned: pinnedRef,
  }
}

/** Lengths the CSS needs to place the copy and stop it at the table's end. */
function publishLayout(
  root: HTMLElement,
  scroller: HTMLElement,
  table: HTMLTableElement,
  thead: HTMLTableSectionElement,
) {
  setVariable(root, HEIGHT_VARIABLE, thead.getBoundingClientRect().height)
  setVariable(
    root,
    BOTTOM_GAP_VARIABLE,
    root.getBoundingClientRect().bottom - table.getBoundingClientRect().bottom,
  )
  setVariable(
    root,
    MAX_SCROLL_VARIABLE,
    scroller.scrollWidth - scroller.clientWidth,
  )
}

/**
 * Every pinned column sticks the same 1px before where it starts (see
 * `getPinnedLeftVariable`), so the copy's pinned layer can move as one.
 * Returns the variables set, for cleanup.
 */
function publishPinnedColumns(
  root: HTMLElement,
  table: HTMLTableElement,
  widths: number[],
) {
  const pinnedCount = countPinnedColumns(table)
  setVariable(root, PINNED_WIDTH_VARIABLE, sum(widths.slice(0, pinnedCount)))
  return getColumnLefts(widths)
    .slice(0, pinnedCount)
    .map((left, i) => {
      const variable = getPinnedLeftVariable(i)
      setVariable(root, variable, left - STICKY_OVERLAP_PX)
      return variable
    })
}

/**
 * The cells of the header row that has one cell per column, so they measure
 * the columns. Grouped rows span several columns and the divider spans all.
 */
function getColumnCells(table: HTMLTableElement) {
  const columnCount = table.querySelectorAll(':scope > colgroup > col').length
  const row = Array.from(table.tHead?.rows ?? []).find(
    (row) => row.cells.length === columnCount,
  )
  return row ? Array.from(row.cells) : []
}

/**
 * A copy uses a fixed layout with the real columns' widths, so its cells land
 * exactly where the real ones are no matter what its own content would want.
 * Returns false when the two tables disagree on the column count, in which case
 * the real header keeps showing.
 */
function alignColumns(
  table: HTMLTableElement,
  copy: HTMLTableElement,
  widths: number[],
) {
  const cols = copy.querySelectorAll('col')
  if (widths.length === 0 || widths.length !== cols.length) return false

  cols.forEach((col, i) => {
    col.style.width = `${widths[i]}px`
  })
  copy.style.width = `${table.getBoundingClientRect().width}px`
  return true
}

/** Pinned columns lead the table. */
function countPinnedColumns(table: HTMLTableElement) {
  const cells = getColumnCells(table)
  const count = cells.findIndex(
    (cell) => !cell.hasAttribute(PINNED_CELL_ATTRIBUTE),
  )
  return count === -1 ? cells.length : count
}

function getColumnLefts(widths: number[]) {
  return widths.map((_, i) => sum(widths.slice(0, i)))
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function setVariable(element: HTMLElement, name: string, px: number) {
  element.style.setProperty(name, `${px}px`)
}
