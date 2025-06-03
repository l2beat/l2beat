import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { ContentWrapper } from '~/components/ContentWrapper'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/MobileProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { TopNavLayout } from '~/layouts/TopNavLayout'
import { EthereumDaProjectSummary } from '~/pages/data-availability/project/components/EthereumDaProjectSummary'
import { RegularDaProjectSummary } from '~/pages/data-availability/project/components/RegularDaProjectSummary'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'

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
