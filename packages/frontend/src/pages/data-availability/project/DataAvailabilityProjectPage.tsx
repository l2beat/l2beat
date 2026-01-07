import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { CssVariables } from '~/components/CssVariables'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
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
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
            data-has-colors={!!entry.colors}
          >
            {entry.colors && (
              <CssVariables
                variables={{
                  'project-primary': entry.colors.primary,
                  'project-secondary': entry.colors.secondary,
                }}
              />
            )}
            <div className="-z-1 -translate-y-2/5 fixed h-[1440px] w-[900px] translate-x-1/5 rotate-[30deg] bg-radial-[ellipse_closest-side_at_center] from-branding-primary via-25% via-branding-secondary to-transparent max-md:hidden" />

            {!isNavigationEmpty && (
              <div className="md:-mx-6 sticky top-0 z-100 lg:hidden">
                <MobileSectionNavigation sections={navigationSections} />
              </div>
            )}
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="-z-1 absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-branding-primary/75 to-surface-primary md:hidden" />

              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={entry}
                    ongoingAnomaly={
                      entry.entryType === 'common'
                        ? entry.header.ongoingAnomaly
                        : undefined
                    }
                    livenessSectionHref="#da-bridge-liveness"
                  />
                  <ProjectSummaryBars
                    project={{
                      archivedAt: entry.archivedAt,
                      isUpcoming: entry.isUpcoming,
                      underReviewStatus: entry.isUnderReview
                        ? 'config'
                        : undefined,
                      header: {},
                    }}
                  />
                  <div className="mb-3 max-md:hidden">
                    <DesktopProjectLinks projectLinks={entry.header.links} />
                  </div>
                </div>
                <div className="row-start-2 w-full">
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
                  <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
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
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
