import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { PageContent } from '../../../../components/PageContent'
import { cn } from '../../../../utils/cn'
import { DesktopProjectNavigation } from '../../components/DesktopProjectNavigation'
import { MobileProjectNavigation } from '../../components/MobileProjectNavigation'
import {
  ProjectDetails,
  ProjectDetailsProps,
} from '../../components/ProjectDetails'
import {
  ScalingProjectHeader,
  ScalingProjectHeaderProps,
} from '../../components/ScalingProjectHeader'

export interface ProjectPageProps {
  navbar: NavbarProps
  projectHeader: ScalingProjectHeaderProps
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
        <div className="sticky top-0 z-100 md:hidden">
          <MobileProjectNavigation sections={navigationSections} />
        </div>
      )}
      <PageContent mobileFull>
        <ScalingProjectHeader {...props.projectHeader} />
        {isNavigationEmpty ? (
          <ProjectDetails {...props.projectDetails} />
        ) : (
          <div className="gap-x-12 md:flex">
            <div className="mt-16 hidden w-[242px] shrink-0 md:block">
              <DesktopProjectNavigation
                project={{
                  title: props.projectHeader.title,
                  icon: props.projectHeader.icon,
                  showProjectUnderReview: props.projectHeader.isUnderReview,
                }}
                sections={navigationSections}
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
