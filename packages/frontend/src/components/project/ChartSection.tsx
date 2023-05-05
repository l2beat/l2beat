import React from 'react'

import { Chart, ChartProps } from '../chart/Chart'

export interface ChartSectionProps extends ChartProps {
  id: string
  title: string
}

export function ChartSection(props: ChartSectionProps) {
  return (
    <Chart {...props} mobileFull sectionClassName="-mx-4 md:mx-0 md:mt-16" />
  )
}
