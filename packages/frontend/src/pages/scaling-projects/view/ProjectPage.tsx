import React from 'react'

import {
  Chart,
  ChartProps,
  Footer,
  FooterProps,
  Header,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
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
    <>
      <Navbar {...props.navbar} />
      <PageContent narrow>
        <Header {...props.header} />
        <Chart {...props.chart} />
        {props.showActivityToggle && <ShowProjectActivityToggle />}
        <ProjectDetails {...props.projectDetails} />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
