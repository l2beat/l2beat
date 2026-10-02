import { type RefObject, useLayoutEffect, useRef } from 'react'
import { forwardStickyHeaderInput } from './forwardStickyHeaderInput'
import {
  getPinnedLeftVariable,
  PINNED_CELL_ATTRIBUTE,
  STICKY_OVERLAP_PX,
} from './utils/commonPinningStyles'

const READY_ATTRIBUTE = 'data-sticky-table-ready'
const COLUMN_ROW_ATTRIBUTE = 'data-sticky-table-column-row'
const HEIGHT_VARIABLE = '--sticky-table-header-height'
const BOTTOM_GAP_VARIABLE = '--sticky-table-header-bottom-gap'
const MAX_SCROLL_VARIABLE = '--sticky-table-max-scroll'
const PINNED_WIDTH_VARIABLE = '--sticky-table-pinned-width'
const VARIABLES = [
  HEIGHT_VARIABLE,
  BOTTOM_GAP_VARIABLE,
  MAX_SCROLL_VARIABLE,
  PINNED_WIDTH_VARIABLE,
]

/**
 * Props for the header row that has one cell per column, whose cells measure
 * the columns. Grouped rows span several columns and the divider spans all.
 */
export const stickyTableColumnRowProps = { [COLUMN_ROW_ATTRIBUTE]: '' }

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
  /** The visible copy: the sticky box holding the track and pinned layer. */
  header: RefObject<HTMLDivElement | null>
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
 * unchanged. Browsers without scroll-driven animations keep the real header
 * for good, see `canSlideWithScroller`.
 *
 * The header row with one cell per column carries `stickyTableColumnRowProps`.
 * Call it in the component that renders all the elements: a parent's layout
 * effect runs once every child's ref is attached.
 */
export function useStickyTableHeader(enabled: boolean): StickyTableRefs {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLTableElement>(null)
  const pinnedRef = useRef<HTMLTableElement>(null)

  useLayoutEffect(() => {
    if (!enabled) return
    const root = rootRef.current
    const scroller = scrollerRef.current
    const table = tableRef.current
    const thead = table?.tHead
    const tbody = table?.tBodies[0]
    const header = headerRef.current
    const track = trackRef.current
    const pinned = pinnedRef.current
    if (!root || !scroller || !table || !thead || !tbody || !header) return
    if (!track || !pinned) return
    const canStick = canSlideWithScroller()

    let columns: Columns = { widths: [], pinnedCount: 0 }
    const update = () => {
      columns = measureColumns(thead)
      // The table's own pinned cells use these whether the header sticks or
      // not.
      publishPinnedColumns(root, columns)
      const isAligned = [track, pinned].every((copy) =>
        alignColumns(table, copy, columns.widths),
      )
      const isReady = canStick && isAligned
      root.toggleAttribute(READY_ATTRIBUTE, isReady)
      if (isReady) {
        publishLayout(root, scroller, table, thead)
      }
    }

    const resizeObserver = new ResizeObserver(update)
    const observeLayout = () => {
      resizeObserver.disconnect()
      resizeObserver.observe(root)
      resizeObserver.observe(scroller)
      resizeObserver.observe(table)
      for (const cell of getColumnCells(thead)) {
        resizeObserver.observe(cell)
      }
    }
    // Hiding or reordering columns swaps the header cells being observed, and
    // sorting or loading rows changes which row is last.
    const mutationObserver = new MutationObserver(() => {
      observeLayout()
      update()
    })
    mutationObserver.observe(thead, { childList: true, subtree: true })
    mutationObserver.observe(tbody, { childList: true })
    observeLayout()
    update()
    const stopForwarding = forwardStickyHeaderInput(header, scroller, () =>
      getPinnedWidth(columns),
    )

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      stopForwarding()
      root.removeAttribute(READY_ATTRIBUTE)
      for (const variable of [
        ...VARIABLES,
        ...getPinnedLeftVariables(columns),
      ]) {
        root.style.removeProperty(variable)
      }
    }
  }, [enabled])

  return {
    root: rootRef,
    scroller: scrollerRef,
    table: tableRef,
    header: headerRef,
    track: trackRef,
    pinned: pinnedRef,
  }
}

/**
 * Without a scroll-driven animation the copy could only follow the scroller
 * from a scroll listener, which visibly trails sideways scrolling. A header
 * that does not stick reads better than one that lags.
 */
function canSlideWithScroller() {
  return CSS.supports('animation-timeline', 'scroll()')
}

/**
 * Lengths the CSS needs to place the copy and to stop it when the table's
 * last row reaches it, so it never covers that row.
 */
function publishLayout(
  root: HTMLElement,
  scroller: HTMLElement,
  table: HTMLTableElement,
  thead: HTMLTableSectionElement,
) {
  const lastRow = getLastRow(table)
  const stop = lastRow
    ? lastRow.getBoundingClientRect().top + getBorderWidthAbove(lastRow)
    : table.getBoundingClientRect().bottom
  setVariable(root, HEIGHT_VARIABLE, thead.getBoundingClientRect().height)
  setVariable(
    root,
    BOTTOM_GAP_VARIABLE,
    root.getBoundingClientRect().bottom - stop,
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
 */
function publishPinnedColumns(root: HTMLElement, columns: Columns) {
  setVariable(root, PINNED_WIDTH_VARIABLE, getPinnedWidth(columns))
  getPinnedLeftVariables(columns).forEach((variable, i) => {
    const left = sum(columns.widths.slice(0, i))
    setVariable(root, variable, left - STICKY_OVERLAP_PX)
  })
}

function getPinnedWidth({ widths, pinnedCount }: Columns) {
  return sum(widths.slice(0, pinnedCount))
}

function getPinnedLeftVariables({ pinnedCount }: Columns) {
  return Array.from({ length: pinnedCount }, (_, i) => getPinnedLeftVariable(i))
}

/** The last body row a reader would see; decorative rows are `aria-hidden`. */
function getLastRow(table: HTMLTableElement) {
  const rows = Array.from(table.tBodies[0]?.rows ?? [])
  return rows.findLast((row) => !row.hasAttribute('aria-hidden'))
}

/**
 * A collapsed border straddles the line between two rows, so half of the one
 * above the last row lies inside that row. Left showing under the header's
 * divider, the two read as one thick line. Stopping past the whole border
 * covers it however the browser snaps its halves to device pixels.
 */
function getBorderWidthAbove(row: HTMLTableRowElement) {
  const previousRow = row.previousElementSibling
  if (!previousRow) return 0
  return Number.parseFloat(getComputedStyle(previousRow).borderBottomWidth)
}

function getColumnCells(thead: HTMLTableSectionElement) {
  const row = thead.querySelector<HTMLTableRowElement>(
    `tr[${COLUMN_ROW_ATTRIBUTE}]`,
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

interface Columns {
  /** In column order. */
  widths: number[]
  /** Pinned columns lead the table. */
  pinnedCount: number
}

/**
 * A cell hidden with `display: none` (columns some tables drop on small
 * screens) takes no column, so the cells after it move into the first free
 * columns and the last ones stay empty.
 */
function measureColumns(thead: HTMLTableSectionElement): Columns {
  const cells = getColumnCells(thead)
  const shownCells = cells.filter(
    (cell) => getComputedStyle(cell).display !== 'none',
  )
  const emptyColumns = Array<number>(cells.length - shownCells.length).fill(0)
  const firstUnpinned = shownCells.findIndex(
    (cell) => !cell.hasAttribute(PINNED_CELL_ATTRIBUTE),
  )
  return {
    widths: [
      ...shownCells.map((cell) => cell.getBoundingClientRect().width),
      ...emptyColumns,
    ],
    pinnedCount: firstUnpinned === -1 ? shownCells.length : firstUnpinned,
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0)
}

function setVariable(element: HTMLElement, name: string, px: number) {
  element.style.setProperty(name, `${px}px`)
}
