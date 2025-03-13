import type { ComponentProps, ReactNode } from 'react'
import { Area } from 'recharts'

interface AreaChartProps {
  data: Omit<ComponentProps<typeof Area>, 'ref'>[]
}

export function getAreaChartComponents({ data }: AreaChartProps): ReactNode[] {
  const fillComponents = []
  const strokeComponents = []

  let index = 0
  for (const props of data) {
    fillComponents.push(<Area key={`fill-${index}`} {...props} stroke="none" />)
    strokeComponents.push(
      <Area key={`stroke-${index}`} {...props} fill="none" />,
    )
    index++
  }

  return [...fillComponents, ...strokeComponents]
}
