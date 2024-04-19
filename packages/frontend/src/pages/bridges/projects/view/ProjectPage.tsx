import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { PageContent } from '../../../../components/PageContent'
import { DesktopProjectNavigation } from '../../../../components/project/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '../../../../components/project/navigation/MobileProjectNavigation'
import {
  ProjectDetails,
  ProjectDetailsProps,
} from '../../../project/components/ProjectDetails'
import { ProjectHeader, ProjectHeaderProps } from './ProjectHeader'

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
      <div className="sticky top-0 z-40 md:hidden">
        <MobileProjectNavigation sections={props.projectDetails.items} />
      </div>
      <PageContent mobileFull>
        <BridgesMvpWarning />
        <ProjectHeader {...props.projectHeader} />

        <div className="gap-x-12 md:flex">
          <div className="mt-16 hidden w-[230px] shrink-0 md:block">
            <DesktopProjectNavigation
              project={{
                title: props.projectHeader.title,
                icon: props.projectHeader.icon,
                showProjectUnderReview:
                  props.projectHeader.showProjectUnderReview,
              }}
              sections={props.projectDetails.items}
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
