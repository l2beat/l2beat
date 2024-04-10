import React from 'react'

import { Chart, ChartProps } from '../chart/Chart'
import { ProjectSectionId } from './sectionId'

export interface ChartSectionProps extends ChartProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
}

export function ChartSection(props: ChartSectionProps) {
  return (
    <Chart
      {...props}
      mobileFull
      withoutSeparator
      sectionClassName="-mx-4 md:mx-0 first:md:mt-16 md:mt-10 md:p-10 md:bg-gray-100 md:dark:bg-zinc-900 md:rounded-lg"
      header="project"
    />
  )
}
