import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import { DesktopProjectNavigation } from '../../../components/project/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '../../../components/project/navigation/MobileProjectNavigation'
import { ProjectDetailsSection } from '../props/getProjectDetails'
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
  const project = {
    title: props.projectHeader.title,
    icon: props.projectHeader.icon,
  }

  const sections = props.projectDetails.items.filter(
    (i): i is ProjectDetailsSection => !i.excludeFromNavigation,
  )
  return (
    <>
      <Navbar {...props.navbar} />
      <div className="sticky top-0 z-40 md:hidden">
        <MobileProjectNavigation sections={sections} />
      </div>
      <PageContent mobileFull>
        <ProjectHeader {...props.projectHeader} />
        <div className="grid grid-cols-7 gap-x-12">
          <div className="col-span-2 mt-16 hidden md:block">
            <DesktopProjectNavigation project={project} sections={sections} />
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
