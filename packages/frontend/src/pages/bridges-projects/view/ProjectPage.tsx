import React from 'react'

import {
  Chart,
  ChartProps,
  Footer,
  FooterProps,
  Header,
  HeaderProps,
  NavbarProps,
} from '../../../components'
import { Page } from '../../../components/Page'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'

export interface ProjectPageProps {
  header: HeaderProps
  chart: ChartProps
  projectDetails: ProjectDetailsProps
  footer: FooterProps
  navbar: NavbarProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page navbar={props.navbar}>
      <Header {...props.header} />
      <Chart {...props.chart} />
      <ProjectDetails {...props.projectDetails} />
      <Footer {...props.footer} />
    </Page>
  )
}
