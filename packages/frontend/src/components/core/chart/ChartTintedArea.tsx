import type { ComponentProps } from 'react'
import { Area } from 'recharts'

/** Areas fill flat with a tint of their line colour, not a gradient. */
const AREA_FILL_OPACITY = 0.1

/**
 * An area in one colour: its line, over a flat tint of it. Pass
 * `stroke="none"` for the tint alone.
 */
export function ChartTintedArea({
  color,
  ...props
}: Omit<ComponentProps<typeof Area>, 'ref' | 'fill' | 'fillOpacity'> & {
  color: string | undefined
}) {
  return (
    <Area
      stroke={color}
      fill={color}
      fillOpacity={AREA_FILL_OPACITY}
      {...props}
    />
  )
}
