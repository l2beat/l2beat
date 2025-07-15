import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/MobileProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { BridgesProjectSummary } from './components/BridgesProjectSummary'

interface Props extends AppLayoutProps {
  projectEntry: BridgesProjectEntry
  queryState: DehydratedState
}

export function BridgesProjectPage({
  projectEntry,
  queryState,
  ...props
}: Props) {
  const navigationSections = projectDetailsToNavigationSections(
    projectEntry.sections,
  )
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div className="smooth-scroll">
            {!isNavigationEmpty && (
              <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}

            <div className="pt-6 max-md:bg-surface-primary max-md:px-4 md:pt-6 lg:w-[calc(100%-196px)] lg:pt-[18px]">
              <ProjectHeader project={projectEntry} className="pb-6" />
              <ProjectSummaryBars project={projectEntry} showBridgesWarning />

              {projectEntry.header.description && (
                <div className="md:hidden">
                  <AboutSection description={projectEntry.header.description} />
                </div>
              )}
              <HorizontalSeparator className="md:!my-6 mt-4 md:hidden" />

              <div className="mb-3 max-md:hidden">
                <DesktopProjectLinks
                  projectLinks={projectEntry.header.links}
                  discoUiHref={projectEntry.discoUiHref}
                />
              </div>
            </div>
            {isNavigationEmpty ? (
              <ProjectDetails items={projectEntry.sections} />
            ) : (
              <div className="grid-cols-[1fr_172px] gap-x-6 lg:grid">
                <div className="w-full">
                  <BridgesProjectSummary project={projectEntry} />

                  <HighlightableLinkContextProvider>
                    <ProjectDetails items={projectEntry.sections} />
                  </HighlightableLinkContextProvider>
                </div>
                <div className="mt-2 hidden shrink-0 lg:block">
                  <DesktopProjectNavigation
                    project={{
                      title: projectEntry.shortName ?? projectEntry.name,
                      slug: projectEntry.slug,
                      isUnderReview: !!projectEntry.underReviewStatus,
                      icon: projectEntry.icon,
                    }}
                    sections={navigationSections}
                  />
                </div>
              </div>
            )}
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
