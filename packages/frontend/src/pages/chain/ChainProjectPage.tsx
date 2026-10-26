import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectInteropMetrics } from '~/components/projects/ProjectInteropMetrics'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ChainProjectPageEntry } from '~/server/features/chains/getChainProjectEntry'

interface Props extends AppLayoutProps {
  entry: ChainProjectPageEntry
  queryState: DehydratedState
}

export function ChainProjectPage({ entry, queryState, ...props }: Props) {
  const navigationSections = projectDetailsToNavigationSections(entry.sections)

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
            data-has-colors={false}
          >
            <div className="-z-1 -translate-y-2/5 fixed h-[1440px] w-[900px] translate-x-1/5 rotate-[30deg] bg-radial-[ellipse_closest-side_at_center] from-branding-primary via-25% via-branding-secondary to-transparent max-md:hidden" />

            <StickyMobileSectionNavigation
              sections={navigationSections}
              project={{ name: entry.name, icon: entry.icon }}
            />
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="-z-1 absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-branding-primary/75 to-surface-primary md:hidden" />

              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader project={entry} />
                </div>
                <div className="row-start-2 w-full">
                  <section
                    id="summary"
                    data-role="nav-section"
                    className="w-full scroll-mt-[100vh] border-divider bg-surface-primary px-4 max-md:border-b max-md:pb-4 md:rounded-lg md:p-6"
                  >
                    <ProjectInteropMetrics interop={entry.interop} />
                  </section>
                  <HighlightableLinkContextProvider>
                    <ProjectDetails items={entry.sections} />
                  </HighlightableLinkContextProvider>
                </div>

                <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
                  <DesktopProjectNavigation
                    project={{
                      title: entry.name,
                      slug: entry.slug,
                      isUnderReview: false,
                      icon: entry.icon,
                    }}
                    sections={navigationSections}
                  />
                </div>
              </div>
            </div>
            <ScrollToTopButton />
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
