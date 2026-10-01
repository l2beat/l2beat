import { type RefObject, useLayoutEffect } from 'react'
import {
  getPinnedLeftVariable,
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
  pinnedCell: 'sticky-table-header-pinned',
}

/** Attribute for the header row that has exactly one cell per column. */
export const STICKY_TABLE_COLUMNS_ROW_ATTRIBUTE =
  'data-sticky-table-columns-row'

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
 * This hook copies the real column widths onto the copy and feeds the CSS in
 * `globals.css` the lengths it cannot know. Until it has, the copy stays hidden
 * and the real header shows, so the server-rendered HTML looks unchanged.
 */
export function useStickyTableHeader(
  rootRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!enabled || !root) return
    const parts = getStickyTableParts(root)
    if (!parts) return
    const { scroller, table, thead, copies } = parts

    let pinnedVariables: string[] = []
    const update = () => {
      const widths = getLeafHeaderCells(table).map(
        (cell) => cell.getBoundingClientRect().width,
      )
      const isAligned = copies.every((copy) =>
        alignColumns(table, copy, widths),
      )
      root.toggleAttribute(READY_ATTRIBUTE, isAligned)
      if (!isAligned) return
      publishLayout(root, scroller, table)
      pinnedVariables = publishPinnedColumns(root, table, widths)
    }

    const resizeObserver = new ResizeObserver(update)
    const observeLayout = () => {
      resizeObserver.disconnect()
      resizeObserver.observe(root)
      resizeObserver.observe(scroller)
      resizeObserver.observe(table)
      for (const cell of getLeafHeaderCells(table)) {
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
  }, [rootRef, enabled])
}

/** Lengths the CSS needs to place the copy and stop it at the table's end. */
function publishLayout(
  root: HTMLElement,
  scroller: HTMLElement,
  table: HTMLTableElement,
) {
  const header = table.tHead
  if (!header) return
  setVariable(root, HEIGHT_VARIABLE, header.getBoundingClientRect().height)
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

function getStickyTableParts(root: HTMLDivElement) {
  const { scroller, header } = stickyTableHeaderClassNames
  const scrollerElement = root.querySelector<HTMLElement>(
    `:scope > .${scroller}`,
  )
  const table =
    scrollerElement?.querySelector<HTMLTableElement>(':scope > table')
  const copies = Array.from(
    root.querySelectorAll<HTMLTableElement>(`:scope > .${header} table`),
  )
  if (!scrollerElement || !table?.tHead || copies.length === 0) {
    return undefined
  }
  return {
    scroller: scrollerElement,
    table,
    thead: table.tHead,
    copies,
  }
}

function getLeafHeaderCells(table: HTMLTableElement) {
  const row = table.tHead?.querySelector<HTMLTableRowElement>(
    `:scope > [${STICKY_TABLE_COLUMNS_ROW_ATTRIBUTE}]`,
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
  const slots = getColumnSlots(copy)
  if (widths.length === 0 || widths.length !== slots.length) return false

  slots.forEach((slot, i) => {
    slot.style.width = `${widths[i]}px`
  })
  copy.style.width = `${table.getBoundingClientRect().width}px`
  return true
}

/** One element per column: a `col`, or a `colgroup` without any. */
function getColumnSlots(copy: HTMLTableElement) {
  return Array.from(copy.querySelectorAll('colgroup')).flatMap((group) => {
    const cols = Array.from(group.querySelectorAll('col'))
    return cols.length > 0 ? cols : [group]
  })
}

/** Pinned columns lead the table, their cells are `position: sticky`. */
function countPinnedColumns(table: HTMLTableElement) {
  const cells = getLeafHeaderCells(table)
  const count = cells.findIndex((cell) => cell.style.position !== 'sticky')
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
