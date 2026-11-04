/** Areas fill flat with a tint of their line colour, not a gradient. */
export const AREA_FILL_OPACITY = 0.1

/** An area in one colour: its line, over a flat tint of it. */
export function tinted(color: string | undefined) {
  return { stroke: color, fill: color, fillOpacity: AREA_FILL_OPACITY }
}
