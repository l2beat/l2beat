import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { PageContent } from '../../../../components/PageContent'
import { DesktopProjectNavigation } from '../../components/DesktopProjectNavigation'
import {
  ProjectDetails,
  ProjectDetailsProps,
} from '../../components/header/ProjectDetails'
import {
  ProjectHeader,
  ProjectHeaderProps,
} from '../../components/header/ProjectHeader'
import { MobileProjectNavigation } from '../../components/MobileProjectNavigation'

export interface ProjectPageProps {
  navbar: NavbarProps
  projectHeader: ProjectHeaderProps
  projectDetails: ProjectDetailsProps
  footer: FooterProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <div className="sticky top-0 z-100 md:hidden">
        <MobileProjectNavigation sections={props.projectDetails.items} />
      </div>
      <PageContent mobileFull className="mb-20">
        <ProjectHeader {...props.projectHeader} />
        <div className="gap-x-12 md:flex">
          <div className="mt-16 hidden w-[230px] shrink-0 md:block">
            <DesktopProjectNavigation
              project={{
                title: props.projectHeader.title,
                icon: props.projectHeader.icon,
                showProjectUnderReview: props.projectHeader.isUnderReview,
              }}
              sections={props.projectDetails.items}
            />
          </div>
          <div className="w-full">
            <ProjectDetails {...props.projectDetails} />
          </div>
        </div>
      </PageContent>
      <Footer className="mt-auto" narrow {...props.footer} />
    </>
  )
}
