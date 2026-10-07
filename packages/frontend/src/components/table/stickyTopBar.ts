const TOP_VARIABLE = '--sticky-table-header-top'

/**
 * Ref for a bar that sticks to the top of the page, like the directory tabs or
 * a project page's section nav. Sticky table headers after it, within the same
 * parent, stick right below it (see `sticky-table.css`). Measured rather than
 * declared, because bars change height with the viewport and some hide on wide
 * screens.
 *
 * The bar's parent carries the measurement, so a parent holds one such bar.
 */
export function stickyTopBarRef(bar: HTMLElement | null) {
  const parent = bar?.parentElement
  if (!bar || !parent) return

  const publish = () => {
    const top = Number.parseFloat(getComputedStyle(bar).top) || 0
    const bottom = top + bar.getBoundingClientRect().height
    parent.style.setProperty(TOP_VARIABLE, `${bottom}px`)
  }
  const resizeObserver = new ResizeObserver(publish)
  resizeObserver.observe(bar)
  publish()
  return () => {
    resizeObserver.disconnect()
    parent.style.removeProperty(TOP_VARIABLE)
  }
}
