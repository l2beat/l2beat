import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { MobileProjectNavigation } from '~/components/projects/navigation/MobileProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { EthereumDaProjectSummary } from '~/pages/data-availability/project/components/EthereumDaProjectSummary'
import { RegularDaProjectSummary } from '~/pages/data-availability/project/components/RegularDaProjectSummary'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'

interface Props extends AppLayoutProps {
  entry: DaProjectPageEntry | EthereumDaProjectPageEntry
  queryState: DehydratedState
}

export function DataAvailabilityProjectPage({
  entry,
  queryState,
  ...props
}: Props) {
  const navigationSections = projectDetailsToNavigationSections(entry.sections)
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div className="smooth-scroll max-md:bg-surface-primary">
            {!isNavigationEmpty && (
              <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
                <MobileProjectNavigation sections={navigationSections} />
              </div>
            )}
            <div className="pt-6 max-md:px-4 md:pt-6 lg:w-[calc(100%-196px)] lg:pt-5">
              <ProjectHeader project={entry} />
              <ProjectSummaryBars
                project={{
                  archivedAt: entry.archivedAt,
                  isUpcoming: entry.isUpcoming,
                  underReviewStatus: entry.isUnderReview ? 'config' : undefined,
                  header: {},
                }}
              />
              <div className="mb-3 max-md:hidden">
                <DesktopProjectLinks projectLinks={entry.header.links} />
              </div>
            </div>

            <div className="grid-cols-[1fr_172px] gap-x-6 lg:grid">
              <div className="w-full">
                {entry.entryType === 'ethereum' ? (
                  <EthereumDaProjectSummary project={entry} />
                ) : (
                  <RegularDaProjectSummary project={entry} />
                )}
                <HighlightableLinkContextProvider>
                  <ProjectDetails items={entry.sections} />
                </HighlightableLinkContextProvider>
              </div>

              {!isNavigationEmpty && (
                <div className="mt-2 hidden shrink-0 lg:block">
                  <DesktopProjectNavigation
                    project={{
                      title: entry.name,
                      slug: entry.slug,
                      isUnderReview: entry.isUnderReview,
                      icon: entry.icon,
                    }}
                    sections={navigationSections}
                    projectVariants={entry.projectVariants}
                  />
                </div>
              )}
            </div>
          </div>
          <ScrollToTopButton />
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
