import React from 'react'

import {
  Chart,
  ChartProps,
  Footer,
  Header,
  HeaderProps,
  Navbar,
  Page,
} from '../../../components'
import { PageMetadata } from '../../PageMetadata'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'

export interface ProjectPageProps {
  metadata: PageMetadata
  header: HeaderProps
  chart: ChartProps
  projectDetails: ProjectDetailsProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page metadata={props.metadata} preloadApi={props.chart.endpoint}>
      <Navbar />
      <Header {...props.header} />
      <Chart {...props.chart} />
      <ProjectDetails {...props.projectDetails} />
      <Footer />
    </Page>
  )
}
