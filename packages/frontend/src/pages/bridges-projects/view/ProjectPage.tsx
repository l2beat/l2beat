import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { BridgesMvpWarning } from '../../../components/BridgesMvpWarning'
import { PageContent } from '../../../components/PageContent'
import { DesktopProjectNavigation } from '../../../components/project/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '../../../components/project/navigation/MobileProjectNavigation'
import { BridgeDetailsSection } from '../props/getProjectDetails'
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
    (i): i is BridgeDetailsSection => !i.excludeFromNavigation,
  )

  return (
    <>
      <Navbar {...props.navbar} />
      <div className="sticky top-0 z-40 md:hidden">
        <MobileProjectNavigation sections={sections} />
      </div>
      <PageContent mobileFull>
        <BridgesMvpWarning />
        <ProjectHeader {...props.projectHeader} />
        <div className="grid grid-cols-8 gap-x-12">
          <div className="col-span-2 mt-16 hidden md:block">
            <DesktopProjectNavigation project={project} sections={sections} />
          </div>
          <div className="col-span-full md:col-span-6">
            <ProjectDetails {...props.projectDetails} />
          </div>
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
