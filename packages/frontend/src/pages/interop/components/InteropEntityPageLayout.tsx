import type { ReactNode } from 'react'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import type { ProjectNavigationSection } from '~/components/projects/navigation/types'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface InteropEntityPageLayoutProps {
  navigationSections: ProjectNavigationSection[]
  isNavigationEmpty: boolean
  navigationProject: {
    title: string
    slug: string
    isUnderReview: boolean
    icon: string
  }
  header: ReactNode
  children: ReactNode
}

export function InteropEntityPageLayout({
  navigationSections,
  isNavigationEmpty,
  navigationProject,
  header,
  children,
}: InteropEntityPageLayoutProps) {
  return (
    <SideNavLayout childrenWrapperClassName="md:pt-0">
      {!isNavigationEmpty && (
        <div className="md:-mx-(--tablet-content-horizontal-padding) sticky top-0 z-40 lg:hidden">
          <MobileSectionNavigation sections={navigationSections} />
        </div>
      )}
      <div className="relative z-0 max-md:bg-surface-primary">
        <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
          <div className="pt-6 max-md:px-4 lg:pt-4">{header}</div>
          <div className="row-start-2">{children}</div>
          {!isNavigationEmpty && (
            <div className="row-start-2 mt-4 hidden shrink-0 lg:block">
              <DesktopProjectNavigation
                project={navigationProject}
                sections={navigationSections}
              />
            </div>
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </SideNavLayout>
  )
}
