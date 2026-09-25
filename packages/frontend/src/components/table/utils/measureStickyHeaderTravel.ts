/**
 * The sticky header may travel down until its bottom meets the table's bottom.
 * Observed rather than measured once, because rows load, expand and wrap
 * after mount.
 */
export function measureStickyHeaderTravel(table: HTMLTableElement) {
  const observer = new ResizeObserver(() => {
    const travel = table.offsetHeight - (table.tHead?.offsetHeight ?? 0)
    table.style.setProperty('--sticky-table-header-travel', `${travel}px`)
  })
  observer.observe(table)
  return () => observer.disconnect()
}
