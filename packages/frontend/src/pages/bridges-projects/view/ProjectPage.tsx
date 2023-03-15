import React from 'react'

import {
  Chart,
  ChartProps,
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { BridgesMvpWarning } from '../../../components/BridgesMvpWarning'
import { PageContent } from '../../../components/PageContent'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'
import { ProjectHeader, ProjectHeaderProps } from './ProjectHeader'

export interface ProjectPageProps {
  header: HeaderProps
  projectHeader: ProjectHeaderProps
  chart: ChartProps
  projectDetails: ProjectDetailsProps
  footer: FooterProps
  navbar: NavbarProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent mobileFull>
        <BridgesMvpWarning />
        <ProjectHeader {...props.projectHeader} />
        <Chart {...props.chart} mobileFull />
        <ProjectDetails {...props.projectDetails} />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
