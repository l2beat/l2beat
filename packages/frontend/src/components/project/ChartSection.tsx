import React from 'react'

import { Chart, ChartProps } from '../chart/Chart'
import { ProjectSectionId } from './sectionId'

export interface ChartSectionProps extends ChartProps {
  id: ProjectSectionId
  title: string
}

export function ChartSection(props: ChartSectionProps) {
  return (
    <Chart
      {...props}
      mobileFull
      sectionClassName="-mx-4 md:mx-0 md:mt-16"
      header="project"
    />
  )
}
