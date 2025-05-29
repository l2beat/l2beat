import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ContentWrapper } from '~/components/content-wrapper'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/highlightable-link-context'
import { DesktopProjectNavigation } from '~/components/projects/navigation/desktop-project-navigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/mobile-project-navigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/project-details'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { AppLayout, type AppLayoutProps } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
import { EthereumDaProjectSummary } from '~/pages/data-availability/project/components/ethereum-da-project-summary'
import { RegularDaProjectSummary } from '~/pages/data-availability/project/components/regular-da-project-summary'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/get-da-project-entry'

interface Props extends AppLayoutProps {
  projectEntry: DaProjectPageEntry | EthereumDaProjectPageEntry
  queryState: DehydratedState
}

export function DataAvailabilityProjectPage({
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
            {!isNavigationEmpty && (
              <div className="sticky top-0 z-100 md:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            {projectEntry.entryType === 'ethereum' ? (
              <EthereumDaProjectSummary project={projectEntry} />
            ) : (
              <RegularDaProjectSummary project={projectEntry} />
            )}
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
                        isUnderReview: projectEntry.isUnderReview,
                        icon: projectEntry.icon,
                      }}
                      sections={navigationSections}
                      projectVariants={projectEntry.projectVariants}
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
          <ScrollToTopButton />
        </TopNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
