import type { ComponentProps } from 'react'
import { Area } from 'recharts'
import { chartSeriesStyle } from '../Chart'

interface ChartStrokeOverFillAreaComponentsProps {
  data: Omit<ComponentProps<typeof Area>, 'ref'>[]
}

/**
 * This component generates components for multi-series area charts (non-stacked).
 * It separates each area into two components: one for the fill and one for the stroke.
 * This approach ensures that all strokes are rendered on top of all fills, preventing
 * visual artifacts where strokes from one series might be hidden behind the fill of another.
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
        {...chartSeriesStyle}
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
        {...chartSeriesStyle}
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
