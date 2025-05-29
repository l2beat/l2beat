import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ContentWrapper } from '~/components/content-wrapper'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/get-bridges-project-entry'
import { BridgesMvpWarning } from './components/bridges-mvp-warning'
import { BridgesProjectSummary } from './components/bridges-project-summary'

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
        <TopNavLayout>
          <div className="smooth-scroll">
            <BridgesMvpWarning className="w-full" />
            {!isNavigationEmpty && (
              <div className="sticky top-0 z-100 md:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            <BridgesProjectSummary project={projectEntry} />
            <ContentWrapper mobileFull>
              {isNavigationEmpty ? (
                <ProjectDetails items={projectEntry.sections} />
              ) : (
                <div className="gap-x-12 md:flex">
                  <div className="mt-10 hidden w-[242px] shrink-0 md:block">
                    <DesktopProjectNavigation
                      project={{
                        title: projectEntry.name,
                        slug: projectEntry.slug,
                        isUnderReview: !!projectEntry.underReviewStatus,
                        icon: projectEntry.icon,
                      }}
                      sections={navigationSections}
                    />
                  </div>
                  <div className="w-full">
                    <HighlightableLinkContextProvider>
                      <ProjectDetails items={projectEntry.sections} />
                    </HighlightableLinkContextProvider>
                  </div>
                </div>
              )}
            </ContentWrapper>
            <ScrollToTopButton />
          </div>
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
