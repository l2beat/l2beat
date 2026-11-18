/**
 * Puts `head` where the first chart in `box` meets its right edge, at `value`
 * on a y axis from 0 to `top`, and hides it without one. Moved only when it
 * would look different, as it is placed every frame
 */
export function placeHead(
  head: HTMLElement | null,
  box: HTMLElement | null,
  value: number | null,
  top: number | undefined,
  margin: { top: number; right: number; bottom: number },
) {
  if (!head || !box) return
  const svg =
    box.querySelector<SVGGElement>('.ts-chart__marks')?.ownerSVGElement
  if (!svg || value === null || top === undefined || top <= 0) {
    head.style.visibility = 'hidden'
    return
  }
  const chart = svg.getBoundingClientRect()
  const outer = box.getBoundingClientRect()
  const height = chart.height - margin.top - margin.bottom
  const x = Math.round(chart.right - outer.left - margin.right)
  const y = Math.round(
    chart.top -
      outer.top +
      margin.top +
      (1 - Math.min(value, top) / top) * height,
  )
  const transform = `translate(${x}px, ${y}px)`
  if (head.style.transform !== transform) head.style.transform = transform
  head.style.visibility = 'visible'
}

/**
 * Slides the lines and time labels of the charts in `box` left by how far the
 * window moved past what is drawn, as a transform, so they flow between
 * drawings. It leans on the chart library's class names; without them the
 * charts just move as they are drawn
 */
export function glideCharts(
  box: HTMLElement | null,
  seconds: number,
  span: number,
) {
  if (!box) return
  for (const marks of box.querySelectorAll<SVGGElement>('.ts-chart__marks')) {
    const svg = marks.ownerSVGElement
    if (!svg) continue
    // what slides past the edges must not show
    svg.style.overflow = 'hidden'
    const px = (seconds * svg.viewBox.baseVal.width) / span
    for (const element of svg.querySelectorAll<SVGElement>(
      '.ts-chart__area, .ts-chart__line, .ts-chart__axes > text[text-anchor="middle"]',
    )) {
      // repainting for less than this costs without showing
      if (Math.abs(Number(element.dataset.glide ?? Number.NaN) - px) < 0.1) {
        continue
      }
      element.dataset.glide = String(px)
      element.style.transform = px === 0 ? '' : `translateX(${-px}px)`
    }
  }
}
