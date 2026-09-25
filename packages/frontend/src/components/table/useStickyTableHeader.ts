import { type RefObject, useEffect } from 'react'

const STICKY_TOP_BAR_ATTRIBUTE = 'data-sticky-top-bar'

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
 * scroll container the header sticks to. So the header is shifted down by hand
 * from the window scroll position instead. Pinned columns keep working because
 * their `sticky left` is unaffected by the transform on the header.
 */
export function useStickyTableHeader(
  ref: RefObject<HTMLTableSectionElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const header = ref.current
    const table = header?.closest('table')
    if (!enabled || !header || !table) return

    const topBars = Array.from(
      document.querySelectorAll(`[${STICKY_TOP_BAR_ATTRIBUTE}]`),
    )

    const update = () => {
      const shift = getHeaderShift(table, header, topBars)
      header.style.transform = shift > 0 ? `translateY(${shift}px)` : ''
      header.toggleAttribute('data-stuck', shift > 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(table)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      resizeObserver.disconnect()
      header.style.transform = ''
      header.removeAttribute('data-stuck')
    }
  }, [ref, enabled])
}

function getHeaderShift(
  table: HTMLTableElement,
  header: HTMLTableSectionElement,
  topBars: Element[],
) {
  const stickyTop = Math.max(
    0,
    ...topBars.map((bar) => bar.getBoundingClientRect().bottom),
  )
  const tableTop = table.getBoundingClientRect().top
  // The header stops at the table's bottom edge instead of floating past it.
  const maxShift = Math.max(0, table.offsetHeight - header.offsetHeight)
  const shift = Math.min(Math.max(stickyTop - tableTop, 0), maxShift)
  // Whole pixels keep the text crisp under a compositor transform.
  return Math.round(shift)
}
