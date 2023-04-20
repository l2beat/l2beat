import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import { SectionNavigation } from '../../../components/project/SectionNavigation'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'
import { ProjectHeader, ProjectHeaderProps } from './ProjectHeader'

export interface ProjectPageProps {
  navbar: NavbarProps
  header: HeaderProps
  projectHeader: ProjectHeaderProps
  projectDetails: ProjectDetailsProps
  footer: FooterProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent mobileFull>
        <ProjectHeader {...props.projectHeader} />
        <div className="mt-8 grid grid-cols-7 gap-x-12">
          <div className="col-span-2 hidden md:block">
            <SectionNavigation
              title={props.projectHeader.title}
              icon={props.projectHeader.icon}
            />
          </div>
          <div className="col-span-7 md:col-span-5">
            <ProjectDetails {...props.projectDetails} />
          </div>
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
