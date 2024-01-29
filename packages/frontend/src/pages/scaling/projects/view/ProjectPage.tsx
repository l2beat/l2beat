import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { PageContent } from '../../../../components/PageContent'
import { DesktopProjectNavigation } from '../../../../components/project/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '../../../../components/project/navigation/MobileProjectNavigation'
import { ScalingDetailsSection } from '../props/getProjectDetails'
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
    (i): i is ScalingDetailsSection => !i.excludeFromNavigation,
  )
  return (
    <>
      <Navbar {...props.navbar} />
      <div className="sticky top-0 z-100 md:hidden">
        <MobileProjectNavigation sections={sections} />
      </div>
      <PageContent mobileFull>
        <ProjectHeader {...props.projectHeader} />
        <div className="gap-x-12 md:flex">
          <div className="mt-16 hidden w-[242px] shrink-0 md:block">
            <DesktopProjectNavigation
              project={{
                title: props.projectHeader.title,
                icon: props.projectHeader.icon,
                showProjectUnderReview:
                  props.projectHeader.showProjectUnderReview,
              }}
              sections={sections}
            />
          </div>
          <div className="w-full">
            <ProjectDetails {...props.projectDetails} />
          </div>
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
