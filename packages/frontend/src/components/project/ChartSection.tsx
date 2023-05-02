import React from 'react'

import { Chart, ChartProps } from '../chart/Chart'
import { ProjectDetailsSection } from './ProjectDetailsSection'

export interface ChartSectionProps extends ChartProps {
  id: string
  title: string
}

export function ChartSection(props: ChartSectionProps) {
  const { id, title, ...rest } = props
  return (
    <ProjectDetailsSection title={title} id={id}>
      <Chart {...rest} mobileFull showTitle={false} />
    </ProjectDetailsSection>
  )
}
