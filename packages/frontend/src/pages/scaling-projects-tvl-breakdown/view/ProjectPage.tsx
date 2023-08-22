import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import { ProjectHeader, ProjectHeaderProps } from './ProjectHeader'
import { ProjectDetails } from './ProjectDetails'

export interface ProjectPageProps {
  navbar: NavbarProps
  header: HeaderProps
  projectHeader: ProjectHeaderProps
  footer: FooterProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ProjectHeader {...props.projectHeader} />
        <ProjectDetails />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
