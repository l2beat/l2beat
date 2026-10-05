/**
 * Geometry shared by the table sparklines: a year of value as an area over a
 * baseline, with event ticks below it. See OssificationTimelineChart and
 * AuditsTimelineChart.
 */
export const SPARKLINE_WIDTH = 132
export const SPARKLINE_HEIGHT = 30
export const SPARKLINE_TOP = 2
// The area sits above it, event ticks and the arrow below.
export const SPARKLINE_BASELINE = 24
export const SPARKLINE_LINE_PROPS = {
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const
export const SPARKLINE_SCALE_NOTE =
  "Height is scaled to each project's own peak"
export const SPARKLINE_CRISP = { shapeRendering: 'crispEdges' } as const

/** Centers a 1px line on a device pixel, so it is not blurred over two. */
export function snapToPixel(x: number) {
  return Math.min(Math.max(Math.round(x), 0), SPARKLINE_WIDTH - 1) + 0.5
}

/** Area and line through the samples, from a zero baseline to the peak. */
export function getSparklineAreaPaths(values: (number | null)[]) {
  const peak = Math.max(...values.map((value) => value ?? 0))
  const step = SPARKLINE_WIDTH / (values.length - 1)
  const points = values.flatMap((value, i) =>
    value === null
      ? []
      : [
          {
            x: i * step,
            y:
              SPARKLINE_BASELINE -
              (peak > 0 ? value / peak : 0) *
                (SPARKLINE_BASELINE - SPARKLINE_TOP),
          },
        ],
  )
  const first = points[0]
  const last = points.at(-1)
  if (!first || !last) {
    return undefined
  }
  const line = `M${points.map((p) => `${p.x} ${p.y}`).join(' L')}`
  return {
    line,
    fill: `${line} L${last.x} ${SPARKLINE_BASELINE} L${first.x} ${SPARKLINE_BASELINE} Z`,
  }
}
