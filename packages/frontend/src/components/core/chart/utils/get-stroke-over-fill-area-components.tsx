import type { ComponentProps, ReactNode } from 'react'
import { Area } from 'recharts'

interface AreaChartProps {
  data: Omit<ComponentProps<typeof Area>, 'ref'>[]
}

/**
 * This function generates components for multi-series area charts (non-stacked).
 * It separates each area into two components: one for the fill and one for the stroke.
 * This approach ensures that all strokes are rendered on top of all fills, preventing
 * visual artifacts where strokes from one series might be hidden behind the fill of another.
 * @param data - array of area chart props
 * @example
 * <AreaChart>
 *   {getStrokeOverFillAreaComponents({ data })}
 * </AreaChart>
 */
export function getStrokeOverFillAreaComponents({
  data,
}: AreaChartProps): ReactNode[] {
  const fillComponents = []
  const strokeComponents = []

  let index = 0
  for (const props of data) {
    fillComponents.push(
      <Area
        key={`fill-${index}`}
        isAnimationActive={false}
        fillOpacity={1}
        {...props}
        tooltipType="none"
        legendType="none"
        stroke="none"
      />,
    )
    strokeComponents.push(
      <Area
        key={`stroke-${index}`}
        isAnimationActive={false}
        strokeWidth={2}
        {...props}
        fill="none"
      />,
    )
    index++
  }

  return [...fillComponents, ...strokeComponents]
}
