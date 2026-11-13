import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { EthereumProjectSummary } from '~/pages/ethereum/components/EthereumProjectSummary'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

interface Props extends AppLayoutProps {
  entry: EthereumProjectPageEntry
  queryState: DehydratedState
}

export function EthereumProjectPage({ entry, queryState, ...props }: Props) {
  const navigationSections = projectDetailsToNavigationSections(entry.sections)
  const isNavigationEmpty = navigationSections.length === 0

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
          >
            {!isNavigationEmpty && (
              <StickyMobileSectionNavigation
                sections={navigationSections}
                project={{ name: entry.name, icon: entry.icon }}
              />
            )}
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader project={entry} />
                  <ProjectSummaryBars
                    project={{
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
                  <EthereumProjectSummary project={entry} />
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
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
