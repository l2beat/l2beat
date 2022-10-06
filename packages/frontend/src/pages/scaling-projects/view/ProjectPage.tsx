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
import { ShowProjectActivityToggle } from '../../../components/ShowProjectActivityToggle'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'

export interface ProjectPageProps {
  navbar: NavbarProps
  header: HeaderProps
  chart: ChartProps
  showActivityToggle: boolean
  projectDetails: ProjectDetailsProps
  footer: FooterProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page narrow navbar={props.navbar}>
      <Header {...props.header} />
      <Chart {...props.chart} />
      {props.showActivityToggle && <ShowProjectActivityToggle />}
      <ProjectDetails {...props.projectDetails} />
      <Footer {...props.footer} />
    </Page>
  )
}
