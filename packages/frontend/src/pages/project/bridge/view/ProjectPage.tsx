import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { PageContent } from '../../../../components/PageContent'
import { cn } from '../../../../utils/cn'
import { DesktopProjectNavigation } from '../../components/DesktopProjectNavigation'
import { MobileProjectNavigation } from '../../components/MobileProjectNavigation'
import {
  ProjectDetails,
  ProjectDetailsProps,
} from '../../components/ProjectDetails'
import {
  BridgeProjectHeader,
  BridgeProjectHeaderProps,
} from './BridgeProjectHeader'

export interface ProjectPageProps {
  navbar: NavbarProps
  projectHeader: BridgeProjectHeaderProps
  projectDetails: ProjectDetailsProps
  footer: FooterProps
}

export function ProjectPage(props: ProjectPageProps) {
  const navigationSections = props.projectDetails.items.filter(
    (section) => !section.excludeFromNavigation,
  )
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <>
      <Navbar {...props.navbar} />
      {!isNavigationEmpty && (
        <div className="sticky top-0 z-40 md:hidden">
          <MobileProjectNavigation sections={props.projectDetails.items} />
        </div>
      )}
      <PageContent mobileFull>
        <BridgesMvpWarning />
        <BridgeProjectHeader {...props.projectHeader} />

        {isNavigationEmpty ? (
          <ProjectDetails {...props.projectDetails} />
        ) : (
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
        )}
      </PageContent>
      <Footer
        className={cn(isNavigationEmpty && 'mt-0 md:mt-20')}
        narrow
        {...props.footer}
      />
    </>
  )
}
