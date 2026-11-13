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
