import type { ComponentProps } from 'react'
import { Area } from 'recharts'
import { AREA_FILL_OPACITY } from './areaFillOpacity'

interface ChartStrokeOverFillAreaComponentsProps {
  data: Omit<ComponentProps<typeof Area>, 'ref'>[]
}

/**
 * This component generates components for multi-series area charts (non-stacked).
 * It separates each area into two components: one for the fill and one for the stroke.
 * This approach ensures that all strokes are rendered on top of all fills, preventing
 * visual artifacts where strokes from one series might be hidden behind the fill of another.
 * Each fill is a flat tint of its stroke colour.
 * @param data - array of area chart props
 * @example
 * <AreaChart>
 *   <ChartStrokeOverFillAreaComponents data={data} />
 * </AreaChart>
 */
export function ChartStrokeOverFillAreaComponents({
  data,
}: ChartStrokeOverFillAreaComponentsProps) {
  const fillComponents = []
  const strokeComponents = []

  let index = 0
  for (const props of data) {
    fillComponents.push(
      <Area
        key={`fill-${index}`}
        isAnimationActive={false}
        fillOpacity={AREA_FILL_OPACITY}
        {...props}
        fill={props.stroke}
        tooltipType="none"
        legendType="none"
        stroke="none"
      />,
    )
    strokeComponents.push(
      <Area
        key={`stroke-${index}`}
        isAnimationActive={false}
        {...props}
        fill="none"
      />,
    )
    index++
  }

  return <>{[...fillComponents, ...strokeComponents]}</>
}
