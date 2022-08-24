import React from 'react'

import {
  Chart,
  ChartProps,
  Footer,
  Header,
  HeaderProps,
  Navbar,
} from '../../../components'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'

export interface ProjectPageProps {
  header: HeaderProps
  chart: ChartProps
  projectDetails: ProjectDetailsProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <div className="Page leading-[1.15]">
      <Navbar />
      <Header {...props.header} />
      <Chart {...props.chart} />
      <ProjectDetails {...props.projectDetails} />
      <Footer />
    </div>
  )
}
