const TOP_VARIABLE = '--sticky-table-header-top'

/**
 * Ref for a bar that sticks to the top of the page, like the directory tabs or
 * a project page's section nav. Sticky table headers after it, within the same
 * parent, stick right below it (see `sticky-table.css`). Measured rather than
 * declared, because bars change height with the viewport and some hide on wide
 * screens.
 *
 * The bar's parent carries the measurement, so a parent holds one such bar.
 * The observer's first call, after the next layout, publishes the first
 * value. Measuring in this ref, during the hydration commit, would force the
 * page's first layout there, and the write would make the next forced read
 * restyle everything under the parent.
 */
export function stickyTopBarRef(bar: HTMLElement | null) {
  const parent = bar?.parentElement
  if (!bar || !parent) return

  const publish = () => {
    const style = getComputedStyle(bar)
    // A bar that moves as the page scrolls (the project strip's tabs) declares
    // where it settles; headers stick below that, not below where it is now.
    const settledTop = Number.parseFloat(
      style.getPropertyValue('--sticky-top-bar-top'),
    )
    const top = Number.isNaN(settledTop)
      ? Number.parseFloat(style.top) || 0
      : settledTop
    const height = bar.getBoundingClientRect().height
    // A bar hidden at this width covers nothing, whatever its offsets say.
    const bottom = height === 0 ? 0 : top + height
    parent.style.setProperty(TOP_VARIABLE, `${bottom}px`)
  }
  const resizeObserver = new ResizeObserver(publish)
  resizeObserver.observe(bar)
  return () => {
    resizeObserver.disconnect()
    parent.style.removeProperty(TOP_VARIABLE)
  }
}
