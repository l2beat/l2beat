import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import { projectDetailsToNavigationSections } from '~/components/projects/navigation/types'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectInteropMetrics } from '~/components/projects/ProjectInteropMetrics'
import { StickyMobileSectionNavigation } from '~/components/section-navigation/StickyMobileSectionNavigation'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ChainProjectPageEntry } from '~/server/features/chains/getChainProjectEntry'
import type { ProjectSectionLink } from '~/server/features/projects/getProjectSectionLinks'

interface Props extends AppLayoutProps {
  entry: ChainProjectPageEntry
  sectionLinks: ProjectSectionLink[]
  queryState: DehydratedState
}

export function ChainProjectPage({
  entry,
  sectionLinks,
  queryState,
  ...props
}: Props) {
  const navigationSections = projectDetailsToNavigationSections(entry.sections)

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
        <SideNavLayout childrenWrapperClassName="md:pt-0">
          <div
            className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
            data-project-page
          >
            <StickyMobileSectionNavigation
              sections={navigationSections}
              project={{ name: entry.name, icon: entry.icon }}
            />
            <div className="relative z-0 max-md:bg-surface-primary">
              <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
                <div className="pt-6 max-md:px-4 lg:pt-4">
                  <ProjectHeader
                    project={entry}
                    section="interop"
                    sectionLinks={sectionLinks}
                  />
                </div>
                <div className="row-start-2 w-full">
                  <section
                    id="summary"
                    data-role="nav-section"
                    className="w-full scroll-mt-[100vh] border-divider bg-surface-primary px-4 max-md:border-b max-md:pb-4 md:rounded-xl md:px-6 md:py-5"
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
          </div>
        </SideNavLayout>
      </HydrationBoundary>
    </AppLayout>
  )
}
