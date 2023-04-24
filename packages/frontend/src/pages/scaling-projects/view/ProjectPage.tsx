import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import { DesktopSectionNavigation } from '../../../components/project/section-navigation/DesktopSectionNavigation'
import { MobileSectionNavigation } from '../../../components/project/section-navigation/MobileSectionNavigation'
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
  const sections = props.projectDetails.items.filter(
    (i): i is ProjectDetailsSection => i.isSection === true,
  )
  return (
    <>
      <Navbar {...props.navbar} />
      <div className="sticky top-0 z-[1000] md:hidden">
        <MobileSectionNavigation sections={sections} />
      </div>
      <PageContent mobileFull>
        <ProjectHeader {...props.projectHeader} />
        <div className="mt-8 grid grid-cols-7 gap-x-12">
          <div className="col-span-2 hidden md:block">
            <DesktopSectionNavigation
              title={props.projectHeader.title}
              icon={props.projectHeader.icon}
              sections={sections}
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
