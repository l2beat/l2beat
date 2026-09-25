import { type RefObject, useEffect } from 'react'

const STICKY_TOP_BAR_ATTRIBUTE = 'data-sticky-top-bar'
const TOP_VARIABLE = '--sticky-table-header-top'
const TRAVEL_VARIABLE = '--sticky-table-header-travel'
const SHIFT_VARIABLE = '--sticky-table-header-shift'
const HEIGHT_VARIABLE = '--sticky-table-header-height'

/**
 * Marks an element that sticks to the top of the viewport (like the directory
 * tabs) so that sticky table headers come to rest beneath it instead of
 * sliding under it.
 */
export function stickyTopBarAttributes() {
  return { [STICKY_TOP_BAR_ATTRIBUTE]: '' }
}

/**
 * Keeps a table header in view while the table scrolls under the top of the
 * viewport. `position: sticky` cannot do this here: the table lives in a
 * horizontal scroll wrapper, and that wrapper (not the page) would be the
 * scroll container the header sticks to.
 *
 * The header cells are instead translated by a scroll-driven animation tracking
 * the table's outer wrapper against the page (see `sticky-table-header` in
 * globals.css). It runs on the compositor, so it cannot trail the finger the
 * way a scroll listener does on iOS. This hook only feeds it two measurements:
 * how much room to leave for sticky bars above, and how far the header may
 * travel before it reaches the table's bottom edge. Browsers without
 * scroll-driven animations fall back to following the scroll position from JS.
 *
 * The `thead` must contain no positioned element, or WebKit runs the animation
 * on the main thread again. So the pinned header cells (which are
 * `position: sticky`) are only invisible placeholders inside the table; the
 * visible ones live in an overlay outside the scroller that is natively
 * sticky, which the compositor handles like the tabs bar. This hook copies the
 * placeholders' widths and row heights onto the overlay so both stay aligned.
 */
export function useStickyTableHeader(
  rootRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const root = rootRef.current
    const table = root?.querySelector<HTMLTableElement>(
      'table[data-sticky-table]',
    )
    const header = table?.tHead
    if (!enabled || !root || !table || !header) return
    const overlay = root.querySelector<HTMLElement>(
      '[data-sticky-pinned-header]',
    )

    const topBars = Array.from(
      document.querySelectorAll(`[${STICKY_TOP_BAR_ATTRIBUTE}]`),
    )
    const isScrollDriven = CSS.supports('animation-timeline: view()')

    const measure = () => {
      root.style.setProperty(TOP_VARIABLE, `${getStickyTop(topBars)}px`)
      root.style.setProperty(TRAVEL_VARIABLE, `${getTravel(table, header)}px`)
      root.style.setProperty(HEIGHT_VARIABLE, `${header.offsetHeight}px`)
      if (overlay) alignPinnedOverlay(overlay, header)
    }
    const follow = () => {
      const shift = getHeaderShift(table, header, getStickyTop(topBars))
      root.style.setProperty(SHIFT_VARIABLE, `${shift}px`)
      root.toggleAttribute('data-stuck', shift > 0)
    }
    const update = () => {
      measure()
      if (!isScrollDriven) follow()
    }

    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(table)
    resizeObserver.observe(header)
    for (const bar of topBars) resizeObserver.observe(bar)
    if (!isScrollDriven) {
      window.addEventListener('scroll', follow, { passive: true })
    }

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', follow)
      for (const variable of [
        TOP_VARIABLE,
        TRAVEL_VARIABLE,
        SHIFT_VARIABLE,
        HEIGHT_VARIABLE,
      ]) {
        root.style.removeProperty(variable)
      }
      root.removeAttribute('data-stuck')
    }
  }, [rootRef, enabled])
}

/**
 * Height the bars occupy once stuck, not their current position: at the top of
 * the page a bar still sits in its natural place, below where it will stick.
 */
function getStickyTop(topBars: Element[]) {
  return Math.max(
    0,
    ...topBars.map((bar) => {
      const top = Number.parseFloat(getComputedStyle(bar).top) || 0
      return top + bar.getBoundingClientRect().height
    }),
  )
}

// The header stops at the table's bottom edge instead of floating past it.
function getTravel(table: HTMLTableElement, header: HTMLTableSectionElement) {
  return Math.max(0, table.offsetHeight - header.offsetHeight)
}

function getHeaderShift(
  table: HTMLTableElement,
  header: HTMLTableSectionElement,
  stickyTop: number,
) {
  const tableTop = table.getBoundingClientRect().top
  const shift = Math.min(
    Math.max(stickyTop - tableTop, 0),
    getTravel(table, header),
  )
  // Whole pixels keep the text crisp under a compositor transform.
  return Math.round(shift)
}

/**
 * The overlay's cells and rows take the sizes of their placeholders in the
 * scroller, which the table's auto layout decides.
 */
function alignPinnedOverlay(
  overlay: HTMLElement,
  header: HTMLTableSectionElement,
) {
  const placeholders = header.querySelectorAll<HTMLElement>(
    '[data-sticky-pinned-placeholder]',
  )
  const clones = overlay.querySelectorAll<HTMLElement>(
    '[data-sticky-pinned-clone]',
  )
  clones.forEach((clone, i) => {
    const placeholder = placeholders[i]
    if (placeholder) clone.style.width = `${placeholder.offsetWidth}px`
  })
  const rows = Array.from(header.rows)
  Array.from(overlay.querySelectorAll('tr')).forEach((row, i) => {
    const source = rows[i]
    if (source) row.style.height = `${source.offsetHeight}px`
  })
}
